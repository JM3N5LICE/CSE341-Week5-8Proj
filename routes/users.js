// Import the 'express' module to create a router
const express = require('express');
const router = express.Router();

// Import the 'contactsController' module, which contains functions for handling contact-related routes

const usersController = require('../controllers/users');
const validation = require('../middleware/validate');


// User Routes

router.get('/', usersController.getAllUsers);

router.get('/:id', usersController.getSingleUser);

router.post('/', validation.saveUser, usersController.createUser);

router.put('/:id', validation.saveUser, usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

// Export the router to be used in other modules
module.exports = router;