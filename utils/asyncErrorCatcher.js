const asyncErrorCatcher = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = asyncErrorCatcher;
