const bcrypt = require('bcryptjs');
const { User } = require('../models/userModel');

const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');

const { handlesuccessfulСreation, jwtSign } = require('../utils/utils');

const {
  AUTHORIZATION_ERROR_TEXT,
  USER_ERROR_TEXT,
  SALT_ROUNDS,
  DUPLICATE_RECORD_CODE,
} = require('../utils/constants');

module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let user = await User.create({
      email,
      password: hash,
      name,
    });
    user = user.toObject();
    delete user.password;

    handlesuccessfulСreation(res, user);
  } catch (err) {
    if (err.code === DUPLICATE_RECORD_CODE) {
      next(new ConflictError(USER_ERROR_TEXT.ALREADY_EXISTING));
      return;
    }

    if (err.name === 'ValidationError') {
      next(new BadRequestError(USER_ERROR_TEXT.CREATING));
      return;
    }

    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .orFail(() => {
        next(new UnauthorizedError(AUTHORIZATION_ERROR_TEXT.FAILED));
      })
      .select('+password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      next(new UnauthorizedError(AUTHORIZATION_ERROR_TEXT.FAILED));
      return;
    }

    const token = jwtSign(user);
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).orFail(() => {
      throw new NotFoundError(USER_ERROR_TEXT.MISSING_ID);
    });

    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email, currentEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && currentEmail !== existingUser.email) {
      next(new ConflictError(USER_ERROR_TEXT.ALREADY_USING_MAIL));
      return;
    }

    const user = await User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    ).orFail(() => {
      throw new NotFoundError(USER_ERROR_TEXT.MISSING_ID);
    });

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(USER_ERROR_TEXT.UPDATING_PROFILE));
      return;
    }

    next(err);
  }
};
