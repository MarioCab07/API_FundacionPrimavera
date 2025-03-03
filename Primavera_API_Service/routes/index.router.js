const express  = require ('express');
const router = express.Router();

const authRouter  = require ('./auth.router.js');
const beneficiaryRouter  = require ('./beneficiary.router.js');


router.use('/auth', authRouter);
router.use('/beneficiary', beneficiaryRouter);



module.exports =  router;