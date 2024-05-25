import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { google } from 'googleapis';

const app = express();
const PORT = process.env.NODE_ENV || 8000;

const oauth2Client  = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];

app.get('/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type : 'offline',
        scope: scopes,
    });
    res.redirect(url)
});

app.get('/google/redirect', (req, res) => {
    const token = req.query.code;
    res.send("it's working");
});

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});