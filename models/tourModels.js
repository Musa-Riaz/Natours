const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({ //A schema is bascially a blueprint that defines the shape of our document in the collection
    name:{
      required: [true, 'A tour must have a name'],
      unique: true,
      type: 'string'
    },
  
    rating:{
      type: Number,
      default: 4.5
    },
    price:{
      required: [true,'A tour must have a price.'],
      type: Number
    }
  })
  
  const Tour = mongoose.model('Tour',tourSchema);
    
 module.exports = Tour;