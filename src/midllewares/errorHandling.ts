import { TErrorHandlingMiddleWare } from 'typings/middlewares';
import { IAppResBody } from 'typings/responses';
import { AppError } from 'utils/AppError';

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandling: TErrorHandlingMiddleWare<AppError> = (error, req, res, next) => {
  console.error('ERROR', error.stack);

  const modifiedErr = error;
  modifiedErr.statusCode = error.statusCode || 500;
  modifiedErr.status = error.status || 'error';

  const errorJson: IAppResBody = {
    status: modifiedErr.status,
    err_message: modifiedErr.message,
  };

  if (error.additionals !== undefined) {
    errorJson.additionals = error.additionals;
  }

  if (isProduction) {
    res.status(modifiedErr.statusCode).json(errorJson);
  } else {
    res.status(modifiedErr.statusCode).json({ ...errorJson, errors: [{ error: modifiedErr, stack: error.stack }] });
  }
  next();
};
