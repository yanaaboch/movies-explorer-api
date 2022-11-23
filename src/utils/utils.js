const jwt = require('jsonwebtoken');
const { STATUS } = require('./constants');

const { JWT_SECRET, NODE_ENV } = process.env;
const { JWT_SECRET_DEV } = require('./config');

function checkEnvironment() {
  if (NODE_ENV === 'production') return JWT_SECRET;
  return JWT_SECRET_DEV;
}

module.exports.handlesuccessfulСreation = (res, createdObject) => {
  res.status(STATUS.CREATED);
  res.send(createdObject);
};

module.exports.jwtSign = (user) => jwt.sign({ _id: user._id }, checkEnvironment(), {
  expiresIn: '7d',
});

module.exports.jwtVerify = (token) => jwt.verify(token, checkEnvironment());
