const Movie = require('../models/movie');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    if (!movies || movies.length === 0) {
      res.send('Сохраненных фильмов не найдено.');
    }
    return res.status(200).send(movies);
  } catch (err) {
    return next(err);
  }
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const newMovie = await Movie.create({ ...data, owner: req.user._id });
    return res.status(200).send(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы неверные данные.'));
    }
    return next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError('Фильм не найден.'));
    }
    const movieOwnerId = movie.owner.valueOf();
    if (movieOwnerId !== userId) {
      return next(new ForbiddenError('Вы не можете удалить чужой фильм!'));
    }
    await Movie.findByIdAndRemove(movieId);
    return res.status(200).send({ message: 'Фильм успешно удален!' });
  } catch (err) {
    return next(err);
  }
};
