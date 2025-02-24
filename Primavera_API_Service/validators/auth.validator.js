const {body} = require('express-validator');

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,32}$/;

const validators = {
};

validators.sUserRegisterValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3 , max:32}).withMessage('Name must be between 3 and 32 characters long'),
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({min:3 , max:32}).withMessage('Username must be between 3 and 32 characters long'),
    body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .matches(passwordRegexp).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and be at least 8 characters long')
    
    ]
module.exports = validators;