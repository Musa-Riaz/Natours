const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTour = (req, res, next) => {
  //This middleware will prefill the query object with values that will be needed for top-5-tours route
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => { //Exporting the functions directly so that they can be used in our Router files
  

  try {
    //Execute the query

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); //Passing query and queryString arguments and chaining the methods

    const newTour = await features.query;

    //Sending the response
    res.status(200).json({
      status: 'success',
      results: newTour.length,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const newTour = await Tour.findById(req.params.id); //The params property of the request object shows all the variables/parameters of the URL
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const newTour = await Tour.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  //In the POST method we are transmitting the data from the client side to the server
  //res.send('Done'); //This message will be displayed after the request has been posted

  try {
    const newTour = await Tour.create(req.body); //We are using async awiat because this create method returns a Promise
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
