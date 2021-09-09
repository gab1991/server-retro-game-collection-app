const errorHandling = (error, req, res, next) => {
  console.error(error);
  const modifiedErr = { ...error };
  modifiedErr.statusCode = error.StatusCode || 500;
  modifiedErr.status = error.status || 'error';

  res.status(modifiedErr.statusCode).json({
    status: modifiedErr.status,
    message: modifiedErr.message,
  });

  next();
};

module.exports = { errorHandling };
