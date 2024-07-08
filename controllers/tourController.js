const Tour = require('./../models/tourModels');

exports.getAllTours =async (req, res)=>{ //Exporting the functions directly so that they can be used in our Router files
    
    try{
        
        //Building query
        //Filtering
        const queryObj = {...req.query} //Since in javascript, when we assign a variable the value of an object, the variable contains the reference of teh object. Since we need the hard copy of the query object, we will destructure the object in the variable, giving us a new object, queryObj
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((field)=> delete(queryObj[field])); //Deleting all the extra fields that will not be required during filtering

        //Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); //It will find the operators in the query string and replace them with the same operations but with a dollar sign
        console.log(queryStr);

        let query =  Tour.find(JSON.parse(queryStr));


        //Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' '); 
            query = query.sort(req.query.sort); //Mutating the query
        console.log(sortBy);  
         query  = query.sort(sortBy); 
        }else if(req.query.sort){
            query = query.sort('-createdAt'); 
        }

        //Field Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); //Mutating the query

        }
        else{
            query = query.select('-__v'); //Excluding the __v field using the - operator
        }
        //Execute the query
        const newTour = await query;

        //Sending the response
        res.status(200).json({
            status:'success',
            results: newTour.length,
            data:{
                tour: newTour,
            }

        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
    })
    }
}

exports.getTour =async (req, res)=>{
  
    try{
        const newTour = await Tour.findById(req.params.id); //The params property of the request object shows all the variables/parameters of the URL
        res.status(200).json({
            status:'success',
            data:{
                tour: newTour
            }

        })
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}

  exports.updateTour = async (req,res)=>{
  
    try{
        const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    }
    catch(err){
        res.status(400).json({
            status: "error",
            message: err
        })
    }
  
   
}

exports.deleteTour = async  (req, res)=>{
 
    try{
        const newTour = await Tour.deleteOne({_id: req.params.id});
        res.status(200).json({
            status:'success',
            data: null
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}


exports.createTour = async (req, res) => {
     //In the POST method we are transmitting the data from the client side to the server
     //res.send('Done'); //This message will be displayed after the request has been posted
  
     try{
        const newTour = await Tour.create(req.body); //We are using async awiat because this create method returns a Promise 
        res.status(201).json({
            status: 'success',
            data : {
                tour : newTour
            }
        })
     }
     catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
     }
  };
