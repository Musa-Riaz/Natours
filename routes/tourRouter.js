const express = require('express');
const router = express.Router();
const fs = require('fs');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

//router.param('id', tourController.checkID);

router
.route('/tour-stats')
.get(tourController.getTourStats);

router
.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)


router
.route('/top-5-cheap')
.get(tourController.aliasTopTour, tourController.getAllTours);

router
.route('/')
.get(authController.protect, tourController.getAllTours)
.post( tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;
