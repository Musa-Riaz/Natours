const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
if(process.env.NODE_ENV === 'development'){ //Checking if the enviormental variable is set to development, only then we want to use morgan
  app.use(morgan('dev'));
}

// 1) Middlewares
app.use(express.json()); //This middleware is used to get the body property of the request object for express in the POST method of the HTTP
app.use(express.static(`${__dirname}/public`)); //This middleware is used to serve static pages into the website
const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.use((req, res, next)=>{
    console.log("HELLO")
    next();
})

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

 


//3) Routes

app.use('/api/v1/tours', tourRouter);  //Here the express routers(tourRouter and userRouter) are being used as middlewares only on the /api/v1/tours and /api/v1/users routes
app.use('/api/v1/users', userRouter);




module.exports = app;
