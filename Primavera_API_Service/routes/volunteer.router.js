const express = require('express');
const router = express.Router();


//Controller
const volunteerController = require('../controllers/volunteer.controller');

//Middlewares
//Auth
const { authentication, authorization } = require('../middlewares/auth.middleware');
//Validator
const {volunteerCreateValidator} = require('../validators/volunteer.validator')
//Run Validation
const validateFields = require('../middlewares/index.middleware');

/* 
    Routes
*/

// GET ROUTES

//Get all volunteers
router.get('/getAll',authentication,authorization('read_volunteers'),volunteerController.getAllVolunteers);

//Find volunteer
router.get('/find/:identifier',authentication,authorization('read_volunteers'),volunteerController.findVolunteer);


// POST ROUTES

//Create Volunteer
router.post('/create',authentication,authorization('modify_volunteers'),volunteerCreateValidator,validateFields,volunteerController.createVolunteer);

//Create Volunteer User
router.post('/create/user/:identifier',authentication,authorization('modify_users'),volunteerController.createVolunteerUser);


// PUT ROUTES

//Update Volunteer
router.put('/update/:identifier',authentication,authorization('modify_volunteers'),volunteerController.updateVolunteer);


//PATCH ROUTES

//Toggle Active Volunteer

router.patch('/toggle/active/:identifier',authentication,authorization('modify_volunteers'),volunteerController.toggleActive);


//DELETE ROUTES

//Delete Volunteer
router.delete('/delete/:identifier',authentication,authorization('modify_volunteers'),volunteerController.deleteVolunteer);


module.exports = router;
