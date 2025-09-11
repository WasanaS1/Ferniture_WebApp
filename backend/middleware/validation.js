const joi = require('joi');
const { body, validationResult } = require('express-validator');

// Joi schemas for validation
const productSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    image: joi.string().uri().required(),
    category: joi.string().valid('Indoor', 'Outdoor', 'Decorative').required(),
    new_price: joi.number().positive().required(),
    old_price: joi.number().positive().required()
});

const userSignupSchema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
        })
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(1).required()
});

// Validation middleware function
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

// Express-validator rules
const signupValidation = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3-50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number and one special character')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const productValidation = [
    body('name')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3-100 characters')
        .trim(),
    
    body('category')
        .isIn(['Indoor', 'Outdoor', 'Decorative'])
        .withMessage('Category must be Indoor, Outdoor, or Decorative'),
    
    body('new_price')
        .isNumeric()
        .custom(value => {
            if (parseFloat(value) <= 0) {
                throw new Error('New price must be a positive number');
            }
            return true;
        }),
    
    body('old_price')
        .isNumeric()
        .custom(value => {
            if (parseFloat(value) <= 0) {
                throw new Error('Old price must be a positive number');
            }
            return true;
        }),
    
    body('image')
        .notEmpty()
        .withMessage('Image URL is required')
        // Remove strict URL validation temporarily
        .isLength({ min: 1 })
        .withMessage('Image URL cannot be empty')
];

// Validation result checker
const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array().map(error => error.msg)
        });
    }
    next();
};

module.exports = {
    validate,
    productSchema,
    userSignupSchema,
    userLoginSchema,
    signupValidation,
    loginValidation,
    productValidation,
    checkValidationResult
};
