const {body} = require('express-validator');

const validator = {};

validator.beneficiaryRegisterValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3 , max:32}).withMessage('Name must be between 3 and 32 characters long'),
    body('dui')
        .notEmpty().withMessage('DUI is required')
        .isLength({min:9 , max:9}).withMessage('DUI must be 9 characters long'),
    body('phone_number')
        .notEmpty().withMessage('Phone number is required')
        .isLength({min:8 }).withMessage('Phone number must be 8 characters long'),
    body('adress')
        .notEmpty().withMessage('Adress is required'),
    body('birth_place')
        .notEmpty().withMessage('Birth place is required'),
    body('work_occup')
        .notEmpty().withMessage('Work occupation is required'),
    body('birth_date')
        .notEmpty().withMessage('Birth date is required'),
    body('income_level')
        .notEmpty().withMessage('Income level is required'),
    body('pension')
        .notEmpty().withMessage('Pension is required')
        .isBoolean().withMessage('Pension must be a boolean'),
    body('weight')
        .notEmpty().withMessage('Weight is required')
        .isNumeric().withMessage('Weight must be a number'),
body('height')
        .notEmpty().withMessage('Height is required')
        .isNumeric().withMessage('Height must be a number'),
    body('whatsapp')
        .notEmpty().withMessage('Whatsapp is required')
        .isBoolean().withMessage('Whatsapp must be a boolean'),
    body('house_type')
        .notEmpty().withMessage('House type is required'),
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