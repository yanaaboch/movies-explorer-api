const { STATUS } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
