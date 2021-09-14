const isProduction = process.env.NODE_ENV === 'production';

const errorHandling = (error, req, res, next) => {
  console.error('ERROR', error.stack);

  const modifiedErr = error;
  modifiedErr.statusCode = error.statusCode || 500;
  modifiedErr.status = error.status || 'error';

  if (isProduction) {
    res.status(modifiedErr.statusCode).json({
      status: modifiedErr.status,
      message: modifiedErr.message,
    });
  } else {
    res.status(modifiedErr.statusCode).json({
      status: modifiedErr.status,
      message: modifiedErr.message,
      error: modifiedErr,
      stack: error.stack,
    });
  }
  next();
};

module.exports = { errorHandling };
