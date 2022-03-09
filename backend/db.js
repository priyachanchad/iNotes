const mongoose = require('mongoose');
require('dotenv').config()
// const mongoURI = "mongodb://localhost:27017/inote?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const mongoURI = process.env.mongoURI;

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Succesfully connected to MongoDB");
    })
}

module.exports = connectToMongo;