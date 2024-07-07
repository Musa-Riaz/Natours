const { trusted } = require('mongoose');
const Tour = require('./../models/tourModels');


exports.getAllTours =async (req, res)=>{ //Exporting the functions directly so that they can be used in our Router files
    try{
        const newTour = await Tour.find();
        res.status(200).json({
            status:'success',
            data:{
                tour: newTour
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
            message: "There was an error creating the tour"
        })
     }
  };
