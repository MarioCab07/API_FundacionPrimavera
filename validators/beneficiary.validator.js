const {body} = require('express-validator');

const validator = {};

validator.beneficiaryRegisterValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3 , max:32}).withMessage('Name must be between 3 and 32 characters long'),
    body('dui')
        .notEmpty().withMessage('DUI is required')
        .isLength({min:10 , max:10}).withMessage('DUI must be 10 characters long'),
    body('address')
        .notEmpty().withMessage('Adress is required'),
    body('birth_place')
        .notEmpty().withMessage('Birth place is required'),
    body('birth_date')
        .notEmpty().withMessage('Birth date is required'),
    body('whatsapp')
        .notEmpty().withMessage('Whatsapp is required')
        .isBoolean().withMessage('Whatsapp must be a boolean'),
    body('shirt_size')
        .notEmpty().withMessage('Shirt size is required'),
    body('shoe_size')
        .notEmpty().withMessage('Shoe size is required'),
    body('blood_type')
        .notEmpty().withMessage('Blood type is required'),
    body('starting_date')
        .notEmpty().withMessage('Start date is required'),
    body('gender').notEmpty().withMessage("Gender is required")
    

]

module.exports = validator;