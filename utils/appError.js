class AppError extends Error {
    constructor(message, statusCode){
        super(message); //Calling the parent class constructor with the message parameter because the Error class constructor takes only one parameter which is the message

        this.statusCode = statusCode; //Setting the statusCode property of the class to the statusCode parameter
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //If the status code starts with 4, then we will set the status to fail, otherwise we will set it to error
        this.isOperational = true; //Setting the isOperational property to true, so that we can check if the error is operational or not

        Error.captureStackTrace(this, this.constructor); //This method is used to capture the stack trace of the error  
    }
}

module.exports = AppError; //Exporting the AppError class to be used in other files