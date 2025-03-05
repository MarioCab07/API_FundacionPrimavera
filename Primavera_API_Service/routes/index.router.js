const express  = require ('express');
const router = express.Router();

const authRouter  = require ('./auth.router.js');
const beneficiaryRouter  = require ('./beneficiary.router.js');
const inventoryRouter = require('./inventory.router.js')


router.use('/auth', authRouter);
router.use('/beneficiary', beneficiaryRouter);
router.use('/inventory', inventoryRouter);



module.exports =  router;