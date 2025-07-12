const mong=require('mongodb');
const color =require('colors');
//const { error } = require('../Controllers/error');
const mo=mong.MongoClient;

const  MONGO_URL="mongodb+srv://shreyas:shreyas@shreyas.8rxrw.mongodb.net/?retryWrites=true&w=majority&appName=shreyas";

var db;

function connection(){
  mo.connect(MONGO_URL).then(client=>{
    db=client.db('Reminder_Application');
    console.log("Connected to the Mongo Db Suceessfully".blue.bold);
 
  }).catch(err=>{
    console.log("error occured while connecting to the MongoDB ");
    console.log(err);
  });

}

function getdb(){
  if(db == null){
    throw new Error("Mongo NOt Coonected ")
  }
  else{
    return db;
  }
}
  


module.exports={
  connection,
  getdb
}