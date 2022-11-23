const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/constants');

const nameRules = Joi.string().required().min(2).max(30);
const emailRules = Joi.string().required().email();
const passwordRules = Joi.string().required();
const linkRules = Joi.string().required().regex(linkRegex);
const requiredStringRules = Joi.string().required();
const requiredNumberRules = Joi.number().required();
const idRules = Joi.string().alphanum().length(24);

module.exports.validateCreatingUser = celebrate({
  body: Joi.object().keys({
    name: nameRules,
    email: emailRules,
    password: passwordRules,
  }),
});

module.exports.validateLogining = celebrate({
  body: Joi.object().keys({
    email: emailRules,
    password: passwordRules,
  }),
});

module.exports.validateUpdatingUserInfo = celebrate({
  body: Joi.object().keys({
    name: nameRules,
    email: emailRules,
    currentEmail: emailRules,
  }),
});

module.exports.validateMovieData = celebrate({
  body: Joi.object().keys({
    country: requiredStringRules,
    director: requiredStringRules,
    duration: requiredNumberRules,
    year: requiredStringRules,
    description: requiredStringRules,
    image: linkRules,
    trailerLink: linkRules,
    thumbnail: linkRules,
    movieId: requiredNumberRules,
    nameRU: requiredStringRules,
    nameEN: requiredStringRules,
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: idRules,
  }),
});
