const STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const AUTHORIZATION_ERROR_TEXT = {
  WARNING: 'Вам нужно авторизоваться.',
  FAILED: 'Пользователь с такой почтой или паролем не найден.',
};

const USER_ERROR_TEXT = {
  CREATING: 'Переданы некорректные данные при создании пользователя.',
  UPDATING_PROFILE: 'Переданы некорректные данные при обновлении профиля пользователя.',
  MISSING_ID: 'По указанному _id пользователь не найден.',
  ALREADY_EXISTING: 'Такой пользователь уже существует.',
  ALREADY_USING_MAIL: 'Такая электронная почта уже используется.',
};

const MOVIE_ERROR_TEXT = {
  CREATING: 'Переданы некорректные данные при создании фильма.',
  INCORRECT_ID: 'Неправильно указан _id фильма.',
  MISSING_ID: 'По указанному _id фильм не найден.',
  DELETING: 'Нельзя удалить фильм другого пользователя.',
};

const SERVER_ERROR_TEXT = 'Внутренняя ошибка сервера.';

const SALT_ROUNDS = 10;
const DUPLICATE_RECORD_CODE = 11000;

const limiterOptions = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const linkRegex = /https?:\/\/(www\.)?([a-z0-9\-.])+(\.\w*)(\/*([\w\-._~:?#[\]@!$&'()*+,;=]))*/i;

module.exports = {
  STATUS,
  AUTHORIZATION_ERROR_TEXT,
  USER_ERROR_TEXT,
  MOVIE_ERROR_TEXT,
  SERVER_ERROR_TEXT,

  SALT_ROUNDS,
  DUPLICATE_RECORD_CODE,

  limiterOptions,
  corsOptions,

  linkRegex,
};
