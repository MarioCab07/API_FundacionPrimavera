const express  = require ('express');
const router = express.Router();

const authRouter  = require ('./auth.router.js');
const beneficiaryRouter  = require ('./beneficiary.router.js');
const inventoryRouter = require('./inventory.router.js');
const volunteerRouter = require('./volunteer.router.js')


router.use('/auth', authRouter);
router.use('/beneficiary', beneficiaryRouter);
router.use('/inventory', inventoryRouter);
router.use('/volunteer', volunteerRouter);



module.exports =  router;