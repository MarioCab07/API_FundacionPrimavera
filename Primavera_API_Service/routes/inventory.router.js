const express = require('express');
const router = express.Router();

//Controller
const inventoryController = require('../controllers/inventory.controller');

//MIDDLEWARES
//Upload middleware
const upload = require("../middlewares/inventory.middleware");
//Run validation
const validateFields = require('../middlewares/index.middleware');
//Validator
const { createItemValidator } = require('../validators/inventory.validator');
//Auth
const { authentication, authorization } = require('../middlewares/auth.middleware');

/*
    Routes
*/


//POST ROUTES
//Create item
router.post('/create',authentication,authorization('modify_inventory'),upload.single('image'),createItemValidator,validateFields,inventoryController.createItem);



//GET ROUTES
//Get all items
router.get('/getAll',authentication,authorization('read_inventory'),inventoryController.getAll);

//Find item
router.get('/find/:identifier',authentication,authorization('read_inventory'),inventoryController.findItem);

//Get image
router.get('/image/:identifier',authentication,authorization('read_inventory'),inventoryController.getImage);



//PUT ROUTES
//Update item
router.put('/update/:identifier',authentication,authorization('modify_inventory'),inventoryController.updateItem);


//DELETE ROUTES
//Delete item   
router.delete('/delete/:identifier',authentication,authorization('modify_inventory'),inventoryController.deleteItem);


module.exports = router;