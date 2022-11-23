const express = require('express');

const { createUser, login } = require('../controllers/userControllers');
const auth = require('../middlewares/auth');
const { userRoutes } = require('./userRoutes');
const { movieRoutes } = require('./movieRoutes');
const { validateCreatingUser, validateLogining } = require('../middlewares/validate-requests');

const NotFoundError = require('../errors/not-found-error');

const routes = express.Router();

routes.post('/signup', validateCreatingUser, createUser);
routes.post('/signin', validateLogining, login);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);
routes.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена.'));
});

module.exports = { routes };
