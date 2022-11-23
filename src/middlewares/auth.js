const UnauthorizedError = require('../errors/unauthorized-error');
const { jwtVerify } = require('../utils/utils');
const { AUTHORIZATION_ERROR_TEXT } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(AUTHORIZATION_ERROR_TEXT.WARNING);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwtVerify(token);
  } catch (err) {
    next(new UnauthorizedError(AUTHORIZATION_ERROR_TEXT.WARNING));
  }

  req.user = payload;

  next();
};
