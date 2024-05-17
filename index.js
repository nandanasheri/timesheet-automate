const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

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
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}


// function to fill out PDF Form using pdf-lib - define text fields according to timesheet template
async function fillPdfForm(input, output) {
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
        const outCol3 = ['ClassTutorRow1_2', 'ClassTutorRow2_2', 'ClassTutorRow3_2', 'ClassTutorRow4_2', 'ClassTutorRow5_2', 'Class6TutorRow_2', 'ClassTutorRow7_2', 'ClassTutorRow8'];
        const outCol4 = ['OutRow1_4', 'OutRow2_4', 'OutRow3_4', 'OutRow4_4', 'OutRow5_4', 'OutRow6_4', 'OutRow7_4', 'OutRow8_2'];

        const classCol1 = ['OutRow1', 'OutRow2', 'OutRow3', 'OutRow4', 'OutRow5', 'OutRow6', 'OutRow7'];
        const classCol2 = ['OutRow1_3', 'OutRow2_3', 'OutRow3_3', 'OutRow4_3', 'OutRow5_3', 'OutRow6_3', 'OutRow7_3', 'OutRow8_3'];

        const totalHoursCol1 = ['TotalHoursRow1', 'TotalHoursRow2', 'TotalHoursRow3', 'TotalHoursRow4', 'TotalHoursRow5', 'TotalHoursRow6', 'TotalHoursRow7'];
        const totalHoursCol2 = ['TotalHoursRow1_2', 'TotalHoursRow2_2', 'TotalHoursRow3_2', 'TotalHoursRow4_2', 'TotalHoursRow5_2', 'TotalHoursRow6_2', 'TotalHoursRow7_2', 'TotalHoursRow8'];
        
		// Set the values for the form fields.
		nameField.setText('Nandana');
		UINField.setText('678725986');
		emailField.setText('nsher3@uic.edu');
		beginField.setText('5/12/2024');
        endField.setText('5/25/2024');
        dateField.setText('5/24/2024');

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

async function main() {
	const input = 'https://www.cs.uic.edu/~grad/Student_Time_Sheet_Fillable.pdf';
	const output = 'output.pdf';

	const pdfDoc = await fillPdfForm(input, output);
	await saveFilledForm(pdfDoc, output);
}

//main().catch((err) => console.error('Error:', err));
authorize().then(listEvents).catch(console.error);