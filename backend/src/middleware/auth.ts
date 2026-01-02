import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

// Get JWT expiry from env or default to 7 days
const getJwtExpiry = (): string => {
    return process.env.JWT_EXPIRES_IN || '7d';
};

// Parse expiry string to seconds
const parseExpiry = (expiry: string): number => {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 60 * 60 * 24 * 7; // Default 7 days in seconds

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        default: return 60 * 60 * 24 * 7;
    }
};

/**
 * Middleware to protect routes - verifies JWT token
 */
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for Bearer token in Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No token provided
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided',
                code: 'NO_TOKEN',
            });
            return;
        }

        // Verify token
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'default-secret'
            ) as JwtPayload;
        } catch (jwtError: any) {
            // Handle specific JWT errors
            if (jwtError.name === 'TokenExpiredError') {
                res.status(401).json({
                    success: false,
                    message: 'Token expired, please login again',
                    code: 'TOKEN_EXPIRED',
                });
                return;
            }
            if (jwtError.name === 'JsonWebTokenError') {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    code: 'INVALID_TOKEN',
                });
                return;
            }
            throw jwtError;
        }

        // Find user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND',
            });
            return;
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token invalid',
            code: 'AUTH_ERROR',
        });
    }
};

/**
 * Middleware to restrict access to admin users only
 */
export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.',
            code: 'ADMIN_ONLY',
        });
        return;
    }
    next();
};

/**
 * Optional auth middleware - doesn't fail if no token, but attaches user if present
 */
export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || 'default-secret'
                ) as JwtPayload;

                const user = await User.findById(decoded.id).select('-password');
                if (user) {
                    req.user = user;
                }
            } catch {
                // Token invalid or expired, but we don't fail - just continue without user
            }
        }

        next();
    } catch (error) {
        next();
    }
};

/**
 * Generate JWT token for a user
 */
export const generateToken = (userId: string, role: string): string => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = parseExpiry(getJwtExpiry());

    return jwt.sign(
        { id: userId, role },
        secret,
        { expiresIn }
    );
};

/**
 * Verify a token and return the decoded payload
 */
export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as JwtPayload;
    } catch {
        return null;
    }
};
