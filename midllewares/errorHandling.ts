import { TErrorHandlingMiddleWare } from 'typings/middlewares';
import { AppError } from 'utils/AppError';

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandling: TErrorHandlingMiddleWare<AppError> = (error, req, res, next) => {
  console.error('ERROR', error.stack);

  const modifiedErr = error;
  modifiedErr.statusCode = error.statusCode || 500;
  modifiedErr.status = error.status || 'error';

  if (isProduction) {
    res.status(modifiedErr.statusCode).json({
      status: modifiedErr.status,
      err_message: modifiedErr.message,
    });
  } else {
    res.status(modifiedErr.statusCode).json({
      status: modifiedErr.status,
      err_message: modifiedErr.message,
      errors: [{ error: modifiedErr, stack: error.stack }],
    });
  }
  next();
};
