import { body } from 'express-validator';

export const projectValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),
    body('description')
        .optional()
        .trim(),
    body('technologies')
        .optional(),
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean')
];