import { ErrorRequestHandler, RequestHandler } from 'express';
import HttpError, { isHttpError } from '../helpers/http-error';

const notFound: RequestHandler = (req, res, next) => {
  next(new HttpError(404, 'Resource not found'));
};

const exception: ErrorRequestHandler = (err, req, res, next) => {
  const status = isHttpError(err) ? err.status : 500;
  let message: string = err.message;
  if (status === 500) {
    // tslint:disable-next-line: no-console
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal server error';
    }
  }
  res.status(status).json({ error: { message } });
};

export { notFound, exception };
