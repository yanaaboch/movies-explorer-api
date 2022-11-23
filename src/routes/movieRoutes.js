const express = require('express');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movieControllers');
const { validateMovieData, validateId } = require('../middlewares/validate-requests');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validateMovieData, createMovie);
movieRoutes.delete('/:id', validateId, deleteMovie);

module.exports = { movieRoutes };
