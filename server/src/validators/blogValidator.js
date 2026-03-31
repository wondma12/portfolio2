import { body } from 'express-validator';

export const blogValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title must be less than 200 characters'),
    body('content')
        .notEmpty()
        .withMessage('Content is required'),
    body('excerpt')
        .optional()
        .trim(),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    body('cover_image')
        .optional()
        .isURL()
        .withMessage('Cover image must be a valid URL')
];

export const blogUpdateValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Title must be less than 200 characters'),
    body('content')
        .optional(),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published')
];