const {body} = require('express-validator');

const validator = {};

validator.createItemValidator = [
    body('product').notEmpty().withMessage('Product is required').isLength({min:3 , max:32}).withMessage('Product must be between 3 and 32 characters long'),
    body('quantity').notEmpty().withMessage('Quantity is required').isNumeric().withMessage('Quantity must be a number'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    body('category').isLength({min:3 , max:32}).withMessage('Category must be between 3 and 32 characters long'),
    body('state').notEmpty().withMessage('State is required').isLength({min:3 , max:32}).withMessage('State must be between 3 and 32 characters long'),
    body('provider').notEmpty().withMessage('Provider is required').isLength({min:3 , max:32}).withMessage('Provider must be between 3 and 32 characters long'),
    body('origin').isLength({min:3 , max:32}).withMessage('Origin must be between 3 and 32 characters long'),
    body('acquisition_date').notEmpty().withMessage('Acquisition date is required')
];


module.exports = validator;