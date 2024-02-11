// Import the 'express' module to create a router
const express = require('express');
const router = express.Router();

// Use the '/contacts' path and include the routes defined in the 'contacts' module
router.use('/', require('./swagger'));
// router.use('/contacts', require('./contacts'))

router.use('/movies', require('./movies'))
router.use('/users', require('./users'))
// router.use('/groups', require('./groups'))

// Export the router to be used in other modules
module.exports = router;
