import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    register,
    login,
    getMe,
    updateProfile,
    createAdmin,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const handleValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
        return;
    }
    next();
};

// Validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
];

// Public routes
router.post('/register', registerValidation, handleValidation, register);
router.post('/login', loginValidation, handleValidation, login);
router.post('/create-admin', registerValidation, handleValidation, createAdmin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, handleValidation, updateProfile);

export default router;
