import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../services/lead.service.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Application specific handled error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid format for field '${err.path}'`,
    });
    return;
  }

  // Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((val) => val.message);
    res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
    return;
  }

  console.error('[Unhandled Error]:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
