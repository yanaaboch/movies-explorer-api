const { Movie } = require('../models/movieModel');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const { MOVIE_ERROR_TEXT } = require('../utils/constants');
const { handlesuccessfulСreation } = require('../utils/utils');

module.exports.getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner }).sort({ nameRU: -1 });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });

    handlesuccessfulСreation(res, movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(MOVIE_ERROR_TEXT.CREATING));
      return;
    }

    next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  const movieId = req.params.id;
  const currentUser = req.user._id;

  try {
    const movie = await Movie.findById(movieId).orFail(() => {
      throw new NotFoundError(MOVIE_ERROR_TEXT.MISSING_ID);
    });

    if (movie.owner.toString() !== currentUser) {
      throw new ForbiddenError(MOVIE_ERROR_TEXT.DELETING);
    } else {
      await movie.delete();
    }

    res.send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(MOVIE_ERROR_TEXT.INCORRECT_ID));
      return;
    }

    next(err);
  }
};
