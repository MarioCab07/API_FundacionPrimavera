const {body} = require('express-validator');

const validator = {};

validator.volunteerCreateValidator = [
    body('name').notEmpty().withMessage('Name is required').isLength({min:3 , max:32}).withMessage('Name must be between 3 and 64 characters long'),
    body('dui').notEmpty().withMessage('DUI is required').isLength({min:9 , max:9}).withMessage('DUI must be 9 characters long'),
    body('birth_date').notEmpty().withMessage('Birth date is required'),
    body('starting_date').notEmpty().withMessage('Starting date is required'),
    body('occupation').notEmpty().withMessage('Occupation is required'),
    body('phone_number').notEmpty().withMessage('Phone number is required').isLength({min:8 }).withMessage('Phone number must be 8 characters long'),
    body('adress').notEmpty().withMessage('Adress is required'),
    body('service_type').notEmpty().withMessage('Service type is required'),

];

module.exports = validator;