const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Неправильный логин или пароль.'));
    }
    if (!name) {
      next(new BadRequestError('Введите имя.'));
    }
    const user = await User.findOne({ email });
    if (user) {
      next(new ConflictError(`Пользователь с ${email} уже существует.`));
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hash,
      name: req.body.name,
    });
    return res.status(200).send({
      name: newUser.name,
      _id: newUser._id,
      email: newUser.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы неверные данные.'));
    }
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError('Неверный email или пароль.'));
    }
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      return res.send({ token });
    }
    return res.status(201).send('Вы авторизованы.');
  } catch (err) {
    return next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      return next(new NotFoundError('Пользователь не найден.'));
    }
    return res.status(200).send({
      name: currentUser.name,
      email: currentUser.email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.status(200).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Неверный тип данных.'));
    }
    return next(err);
  }
};
