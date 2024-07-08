const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({ //A schema is bascially a blueprint that defines the shape of our document in the collection
    name:{
      required: [true, 'A tour must have a name'],
      unique: true,
      type: 'String' 
    },
  
    duration:{
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    maxGroupSize:{
      type: Number,
      required: [true, 'A tour must have a max group size']
    },

    difficulty:{
      type:'String',
      required: [true, 'A tour must have a difficulty']
    },
    rating:{
      type: Number,
      default: 4.5
    },
    ratingAverage:{
      type: Number,
      default: 4.5 
    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    price:{

      required: [true,'A tour must have a price.'],
      type: Number
    },
    priceDiscount:{
      type: Number,
    },
    summary:{
      type: 'String',
      trim: [true,'The tour must have a description'] //The trim schema option will be used to cut all the whitespaces in the description
    },
    description:{
      type: 'String',
      trim: true
    },
    imageCover:{
      type:'String',
      required:[true, 'The tour must have a cover image']
    },
    images:[String], //Defining images as an array of strings 
    createdAt:{ //The timestamp of the created tour
      type: Date,
      default: Date.now()
    },
    startDates : [Date] //The dates at which the tour starts
  })
  
  const Tour = mongoose.model('Tour',  tourSchema);
    
 module.exports = Tour;