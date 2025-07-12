

const db=require('../dbconnect/databaseconnect')
const dbclass=class Citizenform{
    Citizenform(){

    }


  


//constructor for user data

constructor(email,password,displayname){
  this.email=email;
  this.password=password;
  this.username=displayname;
this.created_at=Date.now(); //auto increment of id
}

//auto increment of id 


  async insertdata(collectioname){
    const databse=db.getdb();
    return databse.collection(collectioname).insertOne(this)
  }

  fetchdata(collectioname){
    const database=db.getdb();
    return database.collection(collectioname).find().toArray();
  }


}
module.exports=dbclass;
