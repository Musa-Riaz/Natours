const express= require('express');
const fs = require('fs');
const tour = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );


exports.getAllTours = (req, res)=>{ //Exporting the functions directly so that they can be used in our Router files
    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        results: tour.length,
        data : {
            tour //This will get us the entire array i.e the complete array of all tour objects
        }
    })
}

exports.getTour = (req, res)=>{
    if(req.params.id *1 > tour.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        })
    }

    const id = req.params.id *1 ; //The params property of the request object shows all the variables/parameters of the URL
    const Tour = tour.find(el => el.id === id)
    console.log(Tour);
    res.status(200).json({
        status:'success',
        data:{
            Tour
        }
    })
}

  exports.updateTour =  (req,res)=>{
    if(req.params.id * 1 > tour.length){ //The params property of the request object shows all the variables/parameters of the URL
        return res.status(404).json({
            status: "fail",
            message:"Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data:{
            tour: "<Updated Data>......."
        }
    })
   
}

exports.deleteTour =  (req, res)=>{
    if(req.params.id * 1 > tour.length){
        return res.status(404).json({
            status:"fail",
            message: "Invalid Id"
        })

    }
    
    res.status(204).json({
        status:"success",
        data: null
    })
}

exports.checkID = (req, res, next, val) =>{ //The param middleware has 4 parameters. The value parameter will contain the value of the URL
    if(req.params.id * 1 > tour.length){ //The params property of the request object shows all the variables/parameters of the URL
        console.log(`The Id is ${val}`)
        return res.status(404).json({
            status:'fail',
            message: 'Invalid ID'
        });
    }      
    
    next(); 
    
}

exports.checkBody = ((req, res, next)=>{
    if(!req.body.name || !req.body.price) return res.status(400).json({
        status:'fail',
        message:'Missing name or price'
    })
    next();
})


exports.createTour =  (req, res) => {
    //In the POST method we are transmitting the data from the client side to the server
    //res.send('Done'); //This message will be displayed after the request has been posted
  
    const newID = tour[tour.length - 1].id + 1; //Assigning a new ID (making this weird ID ourselves)
    const newTour = Object.assign({ id: newID }, req.body); //Assigning the newTour the created ID and the data requested 
    tour.push(newTour); //This will push our newTour request into the Tour array
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tour), (error)=>{
      res.status(201).json({
          status:"success",
          data:{
              tour : newTour
          }
      })
    }); //This will add the new object on the client side, i.e our own file
  };
