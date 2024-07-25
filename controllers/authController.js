const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const signToken = ((id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})});

exports.signUp = async (req, res) =>{
     
    const newUser =  await User.create({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
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

     //4 check if the user changed the password after the token was issued

    
    next();
}
)
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


