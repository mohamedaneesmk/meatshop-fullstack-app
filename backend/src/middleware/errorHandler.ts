import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    code?: string;
    errors?: any[];
    keyValue?: { [key: string]: any };
}

/**
 * Handle 404 Not Found errors
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
    error.statusCode = 404;
    next(error);
};

/**
 * Centralized error handler
 */
export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';
    let code = err.code || 'SERVER_ERROR';

    // Log error for debugging (in development)
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
    }

    // Handle Mongoose duplicate key error
    if (err.code === '11000' || (err as any).code === 11000) {
        statusCode = 400;
        const keyValue = (err as any).keyValue;
        if (keyValue?.email) {
            message = 'User already exists with this email';
            code = 'DUPLICATE_EMAIL';
        } else if (keyValue?.phone) {
            message = 'User already exists with this phone number';
            code = 'DUPLICATE_PHONE';
        } else {
            message = 'Duplicate value entered';
            code = 'DUPLICATE_VALUE';
        }
    }

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = (err as any).errors;
        const messages = Object.values(errors).map((e: any) => e.message);
        message = messages.join(', ');
        code = 'VALIDATION_ERROR';
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
        code = 'INVALID_ID';
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired, please login again';
        code = 'TOKEN_EXPIRED';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        code,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

/**
 * Async handler wrapper to avoid try-catch blocks in controllers
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
