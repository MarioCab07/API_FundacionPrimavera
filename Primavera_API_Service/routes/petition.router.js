const express = require('express');
const router = express.Router();

//CONTROLLER
const petitionController = require('../controllers/petition.controller');

//MIDDLEWARES
//AUTH
const { authentication, authorization } = require('../middlewares/auth.middleware');


/*

    Routes

*/

//GET ROUTES
//Get all petitions
router.get('/getAll',authentication,authorization('read_petitions'),petitionController.getPetitions);

//PUT ROUTES
//Resolve Petition
router.put('/resolve/:identifier',authentication,authorization('read_petitions'),petitionController.resolvePetition);

//DELETE ROUTES
//Delete petition
router.delete('/delete/:identifier',authentication,authorization('read_petitions'),petitionController.deletePetition);

//PATH ROUTES
//Reopen petition
router.patch('/reopen/:identifier',authentication,authorization('read_petitions'),petitionController.reopenPetition);



module.exports = router;