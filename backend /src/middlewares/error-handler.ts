import { isCelebrateError } from 'celebrate';
import { Error as MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/not-found-error';

type HttpError = {
  statusCode: number;
  message: string;
};

const isHttpError = (error: unknown): error is HttpError => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const record = error as Record<string, unknown>;
  return typeof record.statusCode === 'number' && typeof record.message === 'string';
};

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    return res.status(400).json({ message: 'Validation error' });
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ message: 'Validation error' });
  }

  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (
    err instanceof BadRequestError
    || err instanceof NotFoundError
    || err instanceof ConflictError
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (isHttpError(err)) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
