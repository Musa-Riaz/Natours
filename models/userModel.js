const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please tell us your name']
    },

    email:{
        type:String,
        required:[true, 'Please provide your email'],
        unique:true,
        lowercase:true, //Converts the email to lowercase
        validate:[validator.isEmail, 'Please provide a valid email']
    },
    photo:{
        type:String
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
        minlength:8,
        select:false //This will not show the password in the output
    },
    
    passwordConfirm:{
        type:String,
        required:[true, 'Please confirm your password'],
        validate:{
            //The this keyword only works on save and create
            validator: function(el){
                return el === this.password; //return true if both the password and the passwordConfirm are the same
            },
            message: 'Passwords are not the same'
        }
    },
    
    
});

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next(); //If the password is not modified, then we will return next

    this.password = await bcrypt.hash(this.password, 12); //We will hash the password with a cost of 12

    this.passwordConfirm = undefined; //We will set the passwordConfirm field to undefined
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword); //This will return true if the password is correct and false if the password is incorrect
}


module.exports = mongoose.model('User', userSchema); //The first argument is the name of the model and the second argument is the schema that we want to use for the model