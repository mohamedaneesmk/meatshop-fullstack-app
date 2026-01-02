import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest, generateToken } from '../middleware/auth';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
            return;
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
        });

        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user with password included
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        const token = generateToken(user._id.toString(), user.role);

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                token,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Create admin user (for initial setup)
// @route   POST /api/auth/create-admin
// @access  Public (should be removed in production)
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if admin exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            res.status(400).json({
                success: false,
                message: 'Admin already exists',
            });
            return;
        }

        const admin = await User.create({
            name,
            email,
            password,
            phone,
            role: 'admin',
        });

        const token = generateToken(admin._id.toString(), admin.role);

        res.status(201).json({
            success: true,
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};
