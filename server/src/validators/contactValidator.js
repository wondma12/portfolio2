import { body } from 'express-validator';

export const contactValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('subject')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subject must be less than 200 characters'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be between 10 and 5000 characters')
];