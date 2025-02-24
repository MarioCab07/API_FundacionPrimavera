const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const {sUserRegisterValidator} = require('../validators/auth.validator');
const validateFields = require('../validators/index.middleware');
const superUserKey = process.env.Super_User_Key;


//auth
//SuperUser route, dont use in frontend
router.post(`/superuser/register/${superUserKey}`,sUserRegisterValidator,validateFields, authController.superUserRegister);



module.exports = router;