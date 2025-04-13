const express = require('express');

const debug = require('debug')('app:ben-router');


const router = express.Router();

//Controller
const beneficiaryController = require("../controllers/beneficiary.controller");

//Middlewares
//Run validation
const validateFields = require('../middlewares/index.middleware');
//Auth
const { authentication, authorization } = require('../middlewares/auth.middleware');
//Validator
const validator = require('../validators/beneficiary.validator');
//Upload middleware
const upload = require('../middlewares/beneficiary.middleware');




/*
    Routes
*/

// GET ROUTES

//Get all beneficiaries
router.get('/getAll',authentication,authorization('read_beneficiaries'),beneficiaryController.getAllBeneficieries);

//Find Beneficiary
router.get('/find/:identifier',authentication,authorization('read_beneficiaries'),beneficiaryController.findBeneciary);

//Get Image
router.get('/photo/:identifier',authentication,authorization('modify_beneficiaries'),beneficiaryController.getPhoto);

//Get Documents
router.get('/read/document/:identifier',authentication,authorization('read_beneficiaries'),beneficiaryController.getBeneficiaryDocuments);

//Get Inactive Beneficiaries
router.get('/inactive',authentication,authorization('read_beneficiaries'),beneficiaryController.getInactiveBeneficiaries);



// POST ROUTES

//Create Beneficiary Register
router.post('/create',
    authentication,
    authorization('modify_beneficiaries'),
    upload.single('photo'),
    validator.beneficiaryRegisterValidator,
    validateFields,
    beneficiaryController.createBeneficiary);

router.post('/upload/document/:identifier',authentication,authorization('modify_beneficiaries'),upload.array('document',10),beneficiaryController.uploadDocument);


// PUT ROUTES

//Update Beneficiary
router.put('/update/:identifier',authentication,authorization('modify_beneficiaries'),beneficiaryController.updateBeneficiary);


// PATCH ROUTES

//Deactivate Beneficiary
router.patch('/toggle/:identifier',authentication,authorization('modify_beneficiaries'),beneficiaryController.toggleActiveBeneficiary);


// DELETE ROUTES
router.delete('/delete/document/:identifier',authentication,
    authorization('modify_beneficiaries'),
    beneficiaryController.deleteDocument)









module.exports = router;
