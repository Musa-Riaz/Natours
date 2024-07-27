const crypto = require('crypto');
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

    role:{
        type: String,
        enum:['admin', 'guide', 'lead-guide', 'user'],
        default:"role"
    }
    ,

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
    

    passwordResetToken : String,
    passwordResetExpires: Date,
    
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next(); //If the password is not modified or the document is new, then we will return next

    this.passwordChangedAt = Date.now() - 1000; //This will ensure that the token is created after the password has been changed
})

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next(); //If the password is not modified, then we will return next

    this.password = await bcrypt.hash(this.password, 12); //We will hash the password with a cost of 12

    this.passwordConfirm = undefined; //We will set the passwordConfirm field to undefined
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword); //This will return true if the password is correct and false if the password is incorrect
}

userSchema.methods.createPasswordResetToken =  function(){
    const resetToken = crypto.randomBytes(32).toString('hex'); //generating a random token

    this.passwordResetToken = crypto //Hashing the reset token in the database
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}); //This will show the reset token
    console.log({passwordResetToken: this.passwordResetToken});  //This will show the password reset token in the database 

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //The token will expire after 10 minutes

    return resetToken; //Returning the unhashed token
}


module.exports = mongoose.model('User', userSchema); //The first argument is the name of the model and the second argument is the schema that we want to use for the model