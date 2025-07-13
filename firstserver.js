const express=require('express');
const firstrouter=require('./Routes/simplerouter');
const db=require('./dbconnect/databaseconnect');
const multer=require('multer');
const cloudinary=require('cloudinary')
const path = require("path");
const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const bodyparser=require('body-parser');
const node=require('node-cron')
const dbclass=require('./model/simpleformodel');
const apis=require('axios');



///session storing in the mongodb
const session= require('express-session');
const mongodbsession= require('connect-mongodb-session')(session);
const DBPATH="mongodb+srv://shreyas:shreyas@shreyas.8rxrw.mongodb.net/?retryWrites=true&w=majority&appName=shreyas";

const morgan=require('morgan');
const color =require('colors');


const app=express();

const store=new mongodbsession({
    uri: DBPATH,
    collection: 'sessions'});







const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    console.log("Inside the destination function of multer");
    cb(null, "Uploads/");
   if (!fs.existsSync(path.join(__dirname, "Uploads/"))) {
     fs.mkdirSync(path.join(__dirname, "Uploads/"), { recursive: true }); // Ensure the folder exists
     }},
     //Date.now() + "-" + file.originalname
    filename: function (req, file, cb) {
    cb(null,"RulesPDF.pdf");}
});
const storageoptions={
  storage
}



app.use(express.static(path.join(__dirname, "Views")));
app.use(express.urlencoded());
app.use(multer(storageoptions).single('filename'));

app.use(session({
  secret: 'shreyas',
  resave: false,
  saveUninitialized: true,
  store: store,}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname, "./Views"));
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use(morgan('dev'));
app.use(express.json({
  extended:true
}))


app.post("/sechdulejob", firstrouter.schedulejob);  //bearere token send karna hai
app.get("/Taskdataget",firstrouter.jwtmiddleware, firstrouter.Taskdataget);  //bearer token send karna hai  //token se fetch kiya 
app.get("/userdatafetch",firstrouter.jwtmiddleware, firstrouter.userdatafetch); // bearer token required 
app.post("/userdatasave", firstrouter.userdatasave); // no bearer token required  //database mai save kiya hai 
app.get("/initial_token_data", firstrouter.initial_token_data);


//this is a request to active the server for  every time okay 
app.get("/hello",(req,res,next)=>{
  console.log("Hello from the client side");
    res.send("hello from the server");
});

function fun(){
//snding the get request to active server for every 10 mins 
 apis.get("https://api-for-notification.onrender.com/home").then((response)=>{
  console.log("i Activated server every 5 minutes ".green.bold );

  
}).catch((err)=>{ console.log("Error in sending the notification".red.bold);
  console.log(err);
});
}






const port=process.env.PORT || 2003;


app.listen(port,()=>{
 node.schedule('*/5 * * * *', () => {
  fun()}); // This will run every 10 minutes
 db.connection();
  console.log("The server started successfully dear");
  console.log("firebase admin initialized successfully".green.bold);
   
    });

  

   
