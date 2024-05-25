const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Function to format time correctly for pdf
 * @param {*} hours 
 * @param {*} minutes 
 * @returns formatted time
 */
function formatTime(hours, minutes) {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  // Format minutes to always have two digits
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours+":"+minutesStr+" "+ampm;
}

/**
 * for number of hours worked for each time period
 */
 function getNumberOfHours (start, end) {
  const startsplit = start.split(' ');
  const endsplit = end.split(' ');
  const starttime = startsplit[0].split(":");
  const endtime = endsplit[0].split(":");
  let starthours =  parseInt(starttime[0], 10);
  let endhours =  parseInt(endtime[0], 10);
  let startmin = 0.0;
  let endmin =  0.0;

  // Convert to 24 hour time
  if (startsplit[1] === "PM" && starttime[0] != "12") {
    starthours += 12;
  }
  if (endsplit[1] === "PM" && endtime[0] != "12") {
    endhours += 12;
  }

  if (starttime[1] === "15") {
    startmin = 0.25;
  }
  else if (starttime[1] === "30") {
    startmin = 0.5;
  }
  else if (starttime[1] === "45") {
    startmin = 0.75;
  }

  if (endtime[1] === "15") {
    endmin = 0.25;
  }
  else if (endtime[1] === "30") {
    endmin = 0.5;
  }
  else if (endtime[1] === "45") {
    endmin = 0.75;
  }

  let diff = (endhours+endmin) - (starthours+startmin)
  return diff;

 }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getWorkHours(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  // Retrieve all calendars
  const res = await calendar.calendarList.list();

  // Term to search by - could be user input in the future
  const keyword = "TA";
  const startDate = "2024-5-12";
  const endDate = "2024-5-26";
  const midpoint = "2024-5-20";
  const allCalendars = res.data.items;
  const workEvents = [];

  for (let i = 0; i < allCalendars.length; i++) {

    // request to Calendar API - only TA events according within current timesheet period
    const allEvents = await calendar.events.list({
    calendarId: allCalendars[i].id,
    timeMin: new Date(startDate).toISOString(),
    timeMax: new Date(endDate).toISOString(),
    singleEvents: true,
    q: keyword,
    orderBy: 'startTime',
    });

    if (allEvents.data.items.length > 0) {

      for (let j = 0; j < allEvents.data.items.length; j++) {

        const startdate = new Date(allEvents.data.items[j].start.dateTime);
        const enddate = new Date(allEvents.data.items[j].end.dateTime);
        let year = startdate.getFullYear();
        let month = startdate.getMonth()+1;
        let dt = startdate.getDate();

        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }
        
        workEvents.push({
          date: month + '/' + dt + '/' + year,
          startTime: formatTime(startdate.getHours(), startdate.getMinutes()),
          endTime: formatTime(enddate.getHours(), enddate.getMinutes()),
          period: startdate <= new Date(midpoint) ? 1 : 2
        });
      }
    }
  }
  return workEvents;
}

// function to fill out PDF Form using pdf-lib - define text fields according to timesheet template
async function fillPdfForm(input, user, workEvents ) {
	try {
		const response = await axios.get(input, {
			responseType: 'arraybuffer',
		});
		const pdfBytes = response.data;
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const form = pdfDoc.getForm();

		// Get the form fields by their names.
		const nameField = form.getTextField('Name');
		const UINField = form.getTextField('UIN');
    const emailField = form.getTextField('Email');
		const beginField = form.getTextField('Begin');
    const endField = form.getTextField('End');
    const dateField = form.getTextField('Date');

    // all repeating fieldnames stored as arrays
    const dateCol1 = ['DateRow1', 'DateRow2', 'DateRow3', 'DateRow4', 'DateRow5', 'DateRow6', 'DateRow7'];
    const dateCol2 = ['DateRow1_2', 'DateRow2_2', 'DateRow3_2', 'DateRow4_2', 'DateRow5_2', 'DateRow6_2', 'DateRow7_2', 'DateRow8'];

    const inCol1 = ['InRow1', 'InRow2', 'InRow3', 'InRow4', 'InRow5', 'InRow6', 'InRow7'];
    const inCol2 = ['InRow1_2', 'InRow2_2', 'InRow3_2', 'InRow4_2', 'InRow5_2', 'InRow6_2', 'InRow7_2'];
    const inCol3 = ['InRow1_3', 'InRow2_3', 'InRow3_3', 'InRow4_3', 'InRow5_3', 'InRow6_3', 'InRow7_3', 'InRow8'];
    const inCol4 = ['InRow1_4', 'InRow2_4', 'InRow3_4', 'InRow4_4', 'InRow5_4', 'InRow6_4', 'InRow7_4', 'InRow8_2'];

    const outCol1 = ['ClassTutorRow1', 'ClassTutorRow2', 'ClassTutorRow3', 'ClassTutorRow4', 'ClassTutorRow5', 'ClassTutorRow6', 'ClassTutorRow7'];
    const outCol2 = ['OutRow1_2', 'OutRow2_2', 'OutRow3_2', 'OutRow4_2', 'OutRow5_2', 'OutRow6_2', 'OutRow7_2'];
    const outCol3 = ['ClassTutorRow1_2', 'ClassTutorRow2_2', 'ClassTutorRow3_2', 'ClassTutorRow4_2', 'ClassTutorRow5_2', 'ClassTutorRow6_2', 'ClassTutorRow7_2', 'ClassTutorRow8'];
    const outCol4 = ['OutRow1_4', 'OutRow2_4', 'OutRow3_4', 'OutRow4_4', 'OutRow5_4', 'OutRow6_4', 'OutRow7_4', 'OutRow8_2'];

    const classCol1 = ['OutRow1', 'OutRow2', 'OutRow3', 'OutRow4', 'OutRow5', 'OutRow6', 'OutRow7'];
    const classCol2 = ['OutRow1_3', 'OutRow2_3', 'OutRow3_3', 'OutRow4_3', 'OutRow5_3', 'OutRow6_3', 'OutRow7_3', 'OutRow8_3'];

    const totalHoursCol1 = ['Total HoursRow1', 'Total HoursRow2', 'Total HoursRow3', 'Total HoursRow4', 'Total HoursRow5', 'Total HoursRow6', 'Total HoursRow7'];
    const totalHoursCol2 = ['Total HoursRow1_2', 'Total HoursRow2_2', 'Total HoursRow3_2', 'Total HoursRow4_2', 'Total HoursRow5_2', 'Total HoursRow6_2', 'Total HoursRow7_2', 'Total HoursRow8'];
        
		// Set the values for the form fields.
		nameField.setText(user.firstName + " " + user.lastName);
		UINField.setText(user.uin);
		emailField.setText(user.email);
		beginField.setText(user.start);
    endField.setText(user.end);
    dateField.setText(user.signdate);

    // Set work Hours
    let j = 0;
    let k = 0;
    const classname = "CS141";
    let firsthalftotal = 0.0;
    let secondhalftotal = 0.0;
    let prevDate = 0;
    let prevHours = 0.0;
    for (let i = 0; i < workEvents.length; i++) {
      let isRightCol = false;   // flag for checking whether the entry is on the same day as the previous entry
      let hours = getNumberOfHours(workEvents[i].startTime, workEvents[i].endTime);
      // previous date and new date are the same -> set entry in the second column and save a row
      if (prevDate == workEvents[i].date) {
        isRightCol = true;
      }

      // first half of pdf
      if (workEvents[i].period === 1) {
        if (isRightCol) {
          j -= 1;
          form.getTextField(inCol2[j]).setText(workEvents[i].startTime);
          form.getTextField(outCol2[j]).setText(workEvents[i].endTime);
          form.getTextField(totalHoursCol1[j]).setText(hours + prevHours +"");
        }
        else {
          form.getTextField(inCol1[j]).setText(workEvents[i].startTime);
          form.getTextField(outCol1[j]).setText(workEvents[i].endTime);
          form.getTextField(totalHoursCol1[j]).setText(hours +"");
        }
        form.getTextField(dateCol1[j]).setText(workEvents[i].date);
        form.getTextField(classCol1[j]).setText(classname);
        firsthalftotal += hours;
        j += 1;
      }

      // second half of pdf
      else if (workEvents[i].period === 2) {
        if (isRightCol) {
          k -= 1;
          form.getTextField(inCol4[k]).setText(workEvents[i].startTime);
          form.getTextField(outCol4[k]).setText(workEvents[i].endTime);
          form.getTextField(totalHoursCol2[k]).setText(hours + prevHours +"");
        }
        else {
          form.getTextField(inCol3[k]).setText(workEvents[i].startTime);
          form.getTextField(outCol3[k]).setText(workEvents[i].endTime);
          form.getTextField(totalHoursCol2[k]).setText(hours +"");
        }
        form.getTextField(dateCol2[k]).setText(workEvents[i].date);
        form.getTextField(classCol2[k]).setText(classname);
        secondhalftotal += hours;
        k += 1;
      }
      prevDate = workEvents[i].date;
      prevHours = hours;
    }
    // Supposed to automatically calculate hours but it doesn't maybe because lack of manual text trigger?
    form.getTextField("Total HoursTotal Week 1 automatically calculates").setText(firsthalftotal+"");
    form.getTextField("Total HoursTotal Week 2 automatically calculates").setText(secondhalftotal+"");

		return pdfDoc;
	} catch (err) {
		console.error('Error:', err);
	}
}

async function saveFilledForm(pdfDoc, output) {
	try {
		const filledFormBytes = await pdfDoc.save();
		fs.writeFileSync(output, filledFormBytes);
		console.log('Filled form saved successfully!');
	} catch (err) {
		console.error('Error saving filled form:', err);
	}
}

async function generatepdf(workEvents) {
	const input = 'https://www.cs.uic.edu/~grad/Student_Time_Sheet_Fillable.pdf';

  const user = {
    firstName : "Nandana",
    lastName : "Sheri", 
    email : "nsher3@uic.edu",
    uin : "678725986",
    start: "5/12/2024",
    end: "5/25/2024",
    signdate: "5/24/2024"
  }

  const endsplit = user.end.split('/');
  const formatend = endsplit[0]+endsplit[1]+endsplit[2];
  const output = user.lastName + '_' + user.firstName + '_Timesheet_' + formatend + '.pdf';
	const pdfDoc = await fillPdfForm(input, user, workEvents);
	await saveFilledForm(pdfDoc, output);
}


authorize().then(getWorkHours).then((workEvents) => {
  generatepdf(workEvents)
}).catch(console.error);