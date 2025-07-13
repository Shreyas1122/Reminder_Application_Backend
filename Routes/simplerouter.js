
const database=require('../dbconnect/databaseconnect');
const dbclass=require('../model/simpleformodel');
const cloudinary=require('cloudinary');
const express=require('express');
const fs = require('fs');
const path = require("path");
const admin=require('firebase-admin');
const supabase = require('../firstserver');
const { error, Console } = require('console');
const {createClient} = require('@supabase/supabase-js');
const imagekit=require('../imagekit');
const bcryptjs=require('bcryptjs');
const apis=require('axios');
const { hash } = require('crypto');
const nodecron=require('node-cron');
require('dotenv').config({ path: './file.env' });
const jwt=require('jsonwebtoken');



  const schedulejob=async(req,res,next)=>{
   const  seconds =req.body.seconds || '0'; // Default to 0 seconds if not provided
    const  minutes =req.body.minutes || '0'; // Default to 0 minutes if not provided
    const  hours =req.body.hours || '0'; // Default to every hour if not provided
    const  datenumber =req.body.dayOfMonth || '1'; // Default to every
    const  month =req.body.month || '1'; // Default to every month if not provided
    const  dayOfWeek =req.body.dayOfWeek || '0'; // Default to every
 
 nodecron.schedule(`${seconds} ${minutes}  ${hours}  ${datenumber} ${month} ${dayOfWeek}`, async () => {
      console.log('Running scheduled job at midnight');
 apis.post("https://api-for-notification.onrender.com/postnotification",{
  title:req.body.title || "Default Title",
    body: req.body.body || "Default Body",
    image:"https://res.cloudinary.com/dmas5gmnx/image/upload/v1740586415/azczlrljysnamwhtrjus.jpg",
    topic:"all_users"
}).then((response)=>{
  console.log("Notification sent successfully".green.bold + response.data );
//save the notification to the jwt token for user specific Tasks

  
  
}).catch((err)=>{ console.log("Error in sending the notification".red.bold);
  console.log(err);
});

      
  
    },{
  timezone: 'Asia/Kolkata'
});

    const tokenData = {
    title: req.body.title || "Default Title",
    body: req.body.body || "Default Body",
    seconds: req.body.seconds || '0',
    minutes: req.body.minutes || '0',
    hours: req.body.hours || '0',
    dayOfMonth: req.body.dayOfMonth || '1',
    month: req.body.month || '1',
    dayOfWeek: req.body.dayOfWeek || '0',
    timestamp: new Date().toISOString()
  };
 //get the old data here 
 const tokens = req.headers.authorization.split(' ')[1];
  if(!tokens){
    return res.status(401).json({
      "success":false,
      "message":"Access Denied! No token provided"
    });
  }
 const decoded=jwt.verify(tokens, process.env.JWT_SECRET_KEY);
 console.log("The old datais as follows "+ decoded.tokenarray);
 const array_of_token=decoded.tokenarray;
  array_of_token.push(tokenData);
  const token_array={
  tokenarray: array_of_token,
}
   
 const token =jwt.sign(token_array, process.env.JWT_SECRET_KEY);
 res.status(200).json({
    success: true,
    message: "Job scheduled successfully",
    token: token
  });
    
  }

const jwtmiddleware=(req,res,next)=>{

 const token = req.headers.authorization.split(' ')[1];
  if(!token){
    return res.status(401).json({
      "success":false,
      "message":"Access Denied! No token provided"
    });
  }
  try{
    
    console.log(token)
    const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    req.user=decoded;
    next();
  }
  catch(error){
    console.log("Error in jwt middleware");
    console.log(error);
    res.status(400).json({
      "success":false,
      "message":"Invalid Token"
    });
  }
}

const initial_token_data =(req,res,next)=>{
  const initialPayload = { tokenarray: [] };
const token = jwt.sign(initialPayload, process.env.JWT_SECRET_KEY);
res.json({
  message: "New token created",
  token: token
});
}

const userdatafetch=(req,res,next)=>{
  usersdata= req.user;
  console.log("User data fetched successfully".green.bold);
  console.log("user email is"+ usersdata.email);
console.log("user password is "+ usersdata.password);
  console.log("user display name is "+ usersdata.displayname); 
  res.status(200).json({
    "success":true,
    "message":"User data fetched successfully",
    user: {
      email: usersdata.email,
      displayname: usersdata.displayname,
    }
  })
}

const Taskdataget=(req,res,next)=>{
  const db=req.user;
  console.log("User data fetched successfully".green.bold);
  console.log("user email is"+ db.title);
  console.log("user password is "+ db.body);
  console.log("user display name is "+ db.seconds); 
  res.status(200).json({
    "success":true,
    "message":"User data fetched successfully",
    Taskdata: db
  })
}

 const userdatasave=(req,res,next)=>{
  const db=new dbclass(req.body.email,req.body.password,req.body.displayname);
  db.insertdata("Users").then((result)=>{
    console.log("Data inserted successfully".green.bold);
    //store the data in the jwt token for users
    const tokenData = {
    email: req.body.email,
    password: req.body.password,
    displayname: req.body.displayname,
    timestamp: new Date().toISOString()
  };
    const token =jwt.sign(tokenData, process.env.JWT_SECRET_KEY);

    res.status(200).json({
      "success":true,
      "message":"User data saved successfully",
      token: token
    });

  }).catch((err)=>{
    console.log("Error in inserting the data".red.bold);
    //console.log(err);
    res.status(500).json({
      "success":false,
      "message":"Error in saving user data"
    });
  });
}



  
module.exports={
 
 schedulejob,
userdatasave,
userdatafetch,
  jwtmiddleware,
  Taskdataget,
  initial_token_data
 
}
