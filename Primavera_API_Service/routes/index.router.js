const express  = require ('express');
const router = express.Router();

const authRouter  = require ('./auth.router.js');
const beneficiaryRouter  = require ('./beneficiary.router.js');
const inventoryRouter = require('./inventory.router.js');
const volunteerRouter = require('./volunteer.router.js');
const petitionRouter = require('./petition.router.js')
const statsRouter = require('./stats.router.js');


router.use('/auth', authRouter);
router.use('/beneficiary', beneficiaryRouter);
router.use('/inventory', inventoryRouter);
router.use('/volunteer', volunteerRouter);
router.use('/petition', petitionRouter);
router.use('/stats',statsRouter);



module.exports =  router;