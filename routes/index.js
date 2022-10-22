const express = require('express');

const router = express.Router();
const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);

// crash-test
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// protected
router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./movies'));

// if request route does not exist
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
