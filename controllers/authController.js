const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = ((id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})});

exports.signUp = async (req, res) =>{
     
    const newUser =  await User.create({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    const token = signToken(newUser._id) //We will create a token here and send it to the user in the response
    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }
    });
};

exports.login = async (req, res, next)=>{

    const {email, password} = req.body;

    const user = await User.findOne({email:email}).select('+password'); //We will select the password here because we have set the select property to false in the schema
   
    if(!email || !password){
        res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        
        })
    }

    if(!user || !(await user.correctPassword(password, user.password))){ //The actual password will be the one that will be created during signup
        return res.status(400).json({
            status: 'fail',
            message: 'Incorrect email or password'
        })
    }

   

  
    const token = signToken(user._id); //We will create a token here and send it to the user in the response
    res.status(200).json({
        status: 'success',
        token
    });
}

exports.protect = catchAsync( async (req, res, next)=>{

     //1 getting token and checking if its there
     let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1] //We will split the token from the Bearer keyword
    }   
    if(!token){
        return next(new AppError("You are not logged in. Please login to get access", 401));

    }

     //2 verfication of the token

     const decode =  jwt.verify(token, process.env.JWT_SECRET); //We will verify the token here and get the id of the user who is logged in, we are getting the payload from the token
    console.log(decode)

     //3 check if user still exists
    const freshUser = await userModel.findById(decode.id); //decode is actually the payload of the token, i.e the part of the token which contains our data
    if(!freshUser) return next(new AppError('The user belonging to this token does no longer exist', 401));


    req.user = freshUser; //We will pass the user to the next middleware so that we can use it in authorization method
    next();
});
 
//authorization method
exports.restrictTo = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next (new AppError("You do not have permission to perform this action", 403));
        }

        next();
    }
}


exports.forgotPassword = catchAsync(async (req, res, next) =>{
    //1 Get user based on the POSTed email
    const user = await userModel.findOne({email: req.body.email});
    if(!user){
        return next(new AppError("There is no user with this e-mail address"), 404);
    }

    //2 Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false}); //We will save the user here without validating the data because we have not provided the passwordConfirm field

    //3 Send it to the users email
        const resetURL = `${req.protocol}://${req.get('host')}//api/v1/users/resetPassword/${resetToken}`;

        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        try{

            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 minutes)',
                message: message
            });
    
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            })

        }
        catch(err){
            console.log(err);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave: false});

            return next(new AppError('There was an error sending the email. Try again later', 500));
        }

     

    next();
})

exports.resetPassword =async  (req, res, next) =>{
    //1 Get user based on token
    const hashedToken  = crypto.createHash('sha256').update(req.params.token).digest('hex'); //Encrypting the token that we will get from the user so that we can compare it with the stored hashed token in the database


    const user = await userModel.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}}); //We will find the user based on the token that we will get from the user and the passwordResetExpires should be greater than the current date

    //2 If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); //We will save the user here

    //3 Update changedPasswordAt property for the user  


    //4 Log the user in, send the new passwords JWT Token
    const token = signToken(user._id); //We will create a token here and send it to the user in the response
    res.status(200).json({
        status:"success",
        token
    })
}

exports.getAllUsers = async (req, res) =>{
    try{

        const users = await User.find({});
        res.status(200).json({
            status: 'success',
            results: users.length,
            data:{
                users
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
 }


