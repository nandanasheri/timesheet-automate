import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { google } from 'googleapis';
import axios from "axios";

const app = express();
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

// generate a url that asks permissions for Blogger and Google Calendar scopes
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
    res.send({
        msg : "You have successfully logged in"
    });
});

// Route to get work hours from google calendar API
app.get('/get/workhours', async (req, res) => {
    // Retrieve all calendars
  const allCals = await calendar.calendarList.list();

  // Term to search by - could be user input in the future
  const keyword = "TA";
  const startDate = "2024-5-12";
  const endDate = "2024-5-26";
  const midpoint = "2024-5-20";
  const allCalendars = allCals.data.items;
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
  res.send({
    msg : "list of work hours :",
    events : workEvents
  });
})

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});