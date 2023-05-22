import express from 'express';

import { google } from 'googleapis';

import dotenv from 'dotenv';

import dayjs from 'dayjs';

dotenv.config({});

const app=express();

const calendar=google.calendar({
    version: "v3",
    auth:process.env.API_KEY
})

const PORT = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar'
  ];



app.get("/Meeting",(req,res) =>{
    const url = oauth2Client.generateAuthUrl({
        access_type:"offline",
        scope:scopes,
    });

    res.redirect(url);
})

app.get("/Meeting/redirect",async (req,res) => {
    const code = req.query.code;

    const {tokens} = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens)
    res.send({
        msg:"login working"
    });

});

app.get("/schedule_event",async (req,res)=>{
    console.log(oauth2Client.credentials.access_token);
    await calendar.events.insert({
        calendarId:"primary",
        auth:oauth2Client,
        requestBody:{
            summary:"this is a test event",
            description:"important  event",
            start:{
                dateTime:dayjs(new Date()).add(1,'day').toISOString,
                timeZone:"Asia/Kolkata",
            },
            end:{
                dateTime:dayjs(new Date()).add(1,'day').add(1,'hour').toISOString,
                timeZone:"Asia/Kolkata",

            },

        },
    })
    res.send({
        msg:"Done"
    })
})

app.listen(PORT,() => {
    console.log("server started",PORT)
})