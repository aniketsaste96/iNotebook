const mongoose = require('mongoose'); //here we are using common module not ES6 

const mongoURI = "mongodb://localhost:27017/aniket?readPreference=primary&appname=MongoDB%20Compass&ssl=false"


//connect to db 

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to Mongo Successfully!!!");
    })
}


module.exports = connectToMongo;
//export