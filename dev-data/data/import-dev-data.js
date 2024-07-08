//creating a script to add the data into database and also delete the data
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
.then(()=>{console.log('Connected to database')});


//Reading json file
const tours =  JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')); //Creating the json object in a javascript object using JSON.parse 

//Import data into the database
async function importData(){
    try{

        await Tour.create(tours); //We will pass the array of javascript objects (tours) into the create method of the Tour model
        console.log('Data successfully imported');
        process.exit();
    }

    catch(err){
        console.log(err);
    }
}


//Delete all the data from the collection of the database

async function deleteData(){
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}

