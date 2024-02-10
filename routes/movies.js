// Import the 'express' module to create a router
const express = require('express');
const router = express.Router();

// Import the 'contactsController' module, which contains functions for handling contact-related routes
const moviesController = require('../controllers/movies');
const usersController = require('../controllers/users');
const groupsController = require('../controllers/groups');

// Define a route to get all contacts
router.get('/', moviesController.getAllMovies);

// Define a route to get a single contact by ID
router.get('/:id', moviesController.getSingleMovie);

// Define a route to post a contact
router.post('/', moviesController.createMovie);

router.put('/:id', moviesController.updateMovie);

router.delete('/:id', moviesController.deleteMovie );

// Export the router to be used in other modules
module.exports = router;

