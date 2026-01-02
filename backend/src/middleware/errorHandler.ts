import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
    success: boolean;
    message: string;
    stack?: string;
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    const response: ErrorResponse = {
        success: false,
        message: err.message,
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};
