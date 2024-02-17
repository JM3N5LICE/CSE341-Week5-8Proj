// Import the 'express' module to create a router
const express = require('express');
const router = express.Router();

// Import the 'contactsController' module, which contains functions for handling contact-related routes
const moviesController = require('../controllers/movies');
// const usersController = require('../controllers/users');
// const groupsController = require('../controllers/groups');
const validation = require('../middleware/validate');

// Movie Routes
router.get('/', moviesController.getAllMovies);

router.get('/:id', moviesController.getSingleMovie);

router.post('/', validation.saveMovie, moviesController.createMovie);

router.put('/:id', validation.saveMovie, moviesController.updateMovie);

router.delete('/:id', moviesController.deleteMovie );

// User Routes

// router.get('/', usersController.getAllUsers);

// router.get('/:id', usersController.getSingleUser);

// router.post('/', usersController.createUser);

// router.put('/:id', usersController.updateUser);

// router.delete('/:id', usersController.deleteUser);

// Export the router to be used in other modules
module.exports = router;

