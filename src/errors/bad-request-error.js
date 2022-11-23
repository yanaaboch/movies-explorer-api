const { STATUS } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
