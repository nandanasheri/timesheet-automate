import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from "cors";
import { google } from 'googleapis';
import {PDFDocument} from 'pdf-lib';
import fs from 'fs';
import axios from "axios";
import process from "process";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {formatTime, getNumberOfHours} from "./helpers.js";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration)

// Define __dirname for ES modules (by defualt in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

let app = express();
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.NODE_ENV || 8000;

const oauth2Client  = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
});

let userinfo = {
  uin : "",
  email : "",
  firstname : "",
  lastname : "",
  searchkey : "",
  startdate : "",
  enddate : "",
  classTA : ""
}

/**
 * Lists events or work hours for particular keyword within timesheet period
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getWorkHours() {
    // Retrieve all calendars
    const res = await calendar.calendarList.list();

    // Term to search by
    const keyword = userinfo.searchkey;
    const startDate = userinfo.startdate.split('T')[0];

    let endObj = (new Date(userinfo.enddate));
    endObj.setDate(endObj.getDate() + 1);
    const endDate = endObj.toISOString().split("T")[0];

    const midpoint = new Date(((new Date(startDate)).getTime() + (new Date(endDate)).getTime()) / 2);
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
            period: startdate <= midpoint ? 1 : 2
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
    const classname = userinfo.classTA;
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
    const filePath = path.join(__dirname, output);
		fs.writeFileSync(filePath, filledFormBytes);
		console.log('Filled form saved successfully!');
	} catch (err) {
		console.error('Error saving filled form:', err);
	}
}

async function generatepdf(workEvents) {
    const input = 'https://www.cs.uic.edu/~grad/Student_Time_Sheet_Fillable.pdf';

    const user = {
    firstName : userinfo.firstname,
    lastName : userinfo.lastname, 
    email : userinfo.email,
    uin : userinfo.uin,
    start: dayjs(userinfo.startdate).format("MM/DD/YYYY"),
    end: dayjs(userinfo.enddate).format("MM/DD/YYYY"),
    signdate: dayjs().format("MM/DD/YYYY")
  }

  const endsplit = user.end.split('/');
  const formatend = endsplit[0]+endsplit[1]+endsplit[2];
  const output = user.lastName + '_' + user.firstName + '_Timesheet_' + formatend + '.pdf';
  const pdfDoc = await fillPdfForm(input, user, workEvents);
  await saveFilledForm(pdfDoc, output);
  // return name of pdf
  return output;
}

// generate a url that asks permissions for Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

// Function to generate Auth URL - authenticate user
app.get('/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type : 'offline',
        scope: scopes,
    });
    res.redirect(url)
});

// User redirects to this page granting access token + refresh token
app.get('/google/redirect', async (req, res) => {
    // Authorization code is returned on successful login
    const code = req.query.code;
    // getAccessToken gives both access token as well as refresh token
    const {tokens}  = await oauth2Client.getToken(code);
    
    oauth2Client.setCredentials(tokens);
    res.redirect(302, "http://localhost:3000/generate");
});


// Route to submit user information and update on server's side
app.post('/submitform', async (req, res) => {
  userinfo = req.body;
  res.send({
        msg : "success"
  });
})

// Route to get work hours from google calendar API
app.get('/generatepdf', async (req, res) => {
    // get work hours from Google Calendar API and generate PDF - returns pdf
    getWorkHours().then((workEvents) => {
        generatepdf(workEvents).then((pdf_filename) => {
          // add absolute path
          const filePath = path.join(__dirname, pdf_filename);
            if (!fs.existsSync(filePath)) {
                throw Error("file does not exist");
            }
            res.download(filePath, pdf_filename, (err) => {
                if (err) {
                    throw Error("error in downloading file")
                }
            });
        })
    }).catch(console.error);
})

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});