const express = require('express');
const {google} = require('googleapis');
const process = require('process');

const app = express();
const PORT = process.env.NODE_ENV || 8000;

const auth2Client  = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

app.get('/google', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
})