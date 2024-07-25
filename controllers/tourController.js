const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
exports.aliasTopTour = (req, res, next) => {
  //This middleware will prefill the query object with values that will be needed for top-5-tours route
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Exporting the functions directly so that they can be used in our Router files

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

 
});

exports.getTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findById(req.params.id); //The params property of the request object shows all the variables/parameters of the URL
  if (!newTour) {
    //If the tour is not found then we will return an error message
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
 
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {

    new: true,
    runValidators: true,
  });
  console.log(newTour)
  if (!newTour) {
    //If the tour is not found then we will return an error message
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {tour: newTour},
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.deleteOne({ _id: req.params.id });

  if (!newTour) {
    //If the tour is not found then we will return an error message
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body); //We are using async awiat because this create method returns a Promise
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//In the POST method we are transmitting the data from the client side to the server
//res.send('Done'); //This message will be displayed after the request has been posted

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  console.log(stats);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  res.status(400).json({
    status: 'fail',
    message: err,
  });
});
