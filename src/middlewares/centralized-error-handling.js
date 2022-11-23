const { STATUS, SERVER_ERROR_TEXT } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = STATUS.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === STATUS.INTERNAL_SERVER_ERROR ? SERVER_ERROR_TEXT : message,
  });

  next();
};
