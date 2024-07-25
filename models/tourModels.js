const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema({ //A schema is bascially a blueprint that defines the shape of our document in the collection

    name:{
      required: [true, 'A tour must have a name'],
      unique: [true, 'A tour must have a unique name'],
      type: String ,
      maxLength:[40,'A tour must have less or equal to 40 characters'],
      minLength:[10,'A tour must have more or equal to 10 characters'],
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
      type:String,
      required: [true, 'A tour must have a difficulty'],
      enum:{
        values: ['easy', 'medium', 'difficult'],
        message:'Difficulty is either: easy, medium or difficult'
      }
    },
    rating:{
      type: Number,
      default: 4.5
    },
    ratingAverage:{
      type: Number,
      default: 4.5 ,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
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
      validate:{
        validator : function(val){
          return val < this.price; //The this keyword only points to the current document when creating a new document
        },
          message: 'Discount price ({VALUE}) should be below the regular price' //The VALUE keyword is used to access the value of the field that is being validated
      }
    },
    summary:{
      type: String,
      trim: [true,'The tour must have a description'] //The trim schema option will be used to cut all the whitespaces in the description
    },
    description:{
      type: String,
      trim: true
    },
    imageCover:{
      type: String,
      required:[true, 'The tour must have a cover image']
    },
    images:[String], //Defining images as an array of strings 
    createdAt:{ //The timestamp of the created tour
      type: Date,
      default: Date.now()
    },
    slug:{
      type: String,
    },
    startDates : [Date], //The dates at which the tour starts
    secretTour:{
      type: Boolean,
      default:false
    }
  })

  //Document middleware: runs before .save() and .create()
  tourSchema.pre('save', function(next){
      this.slug = slugify(this.name, {lower: true}); // This is the currently processed document
      next();
  })

  tourSchema.post('save', function(doc, next){ //tour schema has access to both the document and the next function
    console.log(doc);
    next();
  })


  //Query Middleware
  tourSchema.pre('find', function(next){ //here the this keyword will point to the current query, not the document  
    this.find({secretTour: {$ne: true}});

    this.start = Date.now();

    next();
  })

  tourSchema.post('find', function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
  });

  //Aggregation Middleware
  tourSchema.pre('aggregate', function(next){
     this.pipline().unshift({$match: {secretTour: {$ne: true}}});  
    next();
  })
  
  const Tour = mongoose.model('Tour',  tourSchema);
    
 module.exports = Tour;