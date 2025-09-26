const express =require ('express');
const router = express.Router();

const authController  = require ('../controllers/auth.controller.js');
const authValidator  = require ('../validators/auth.validator.js');
const validateFields  = require ('../middlewares/index.middleware.js');
const {authentication,authorization} = require("../middlewares/auth.middleware.js")

const superUserKey = process.env.Super_User_Key;


//AUTH ROUTES
//POST ROUTES
//SuperUser route, dont use in frontend
router.post(`/superuser/register/${superUserKey}`,authValidator.sUserRegisterValidator,validateFields, authController.superUserRegister);

//Login
router.post(`/login`,authController.login);

//User Register
router.post('/register',authentication,authorization('modify_users'),authValidator.userRegisterValidator,validateFields,authController.userRegister);

//Logout
router.post('/logout',authController.logout);

//Refresh Token
router.post('/refresh',authController.refresh);



//GET ROUTES
//Get all users
router.get('/get/users',authentication,authorization('modify_users'),authController.getAllUsers);

//Who am I
router.get('/whoami',authentication,authController.whoAmi);

//PUT ROUTES
//Update user
router.put('/update/user/:identifier',authentication,authorization('modify_users'),validateFields,authController.updateUser);


//DELETE ROUTES
//Delete user
router.delete('/delete/user/:identifier',authentication,authorization('modify_users'),authController.deleteUser);


module.exports =  router;