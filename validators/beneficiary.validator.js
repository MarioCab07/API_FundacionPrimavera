const {body} = require('express-validator');

const validator = {};

validator.beneficiaryRegisterValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3 , max:32}).withMessage('Name must be between 3 and 32 characters long'),
    body('dui')
        .notEmpty().withMessage('DUI is required')
        .isLength({min:10 , max:10}).withMessage('DUI must be 10 characters long'),

    

]

module.exports = validator;