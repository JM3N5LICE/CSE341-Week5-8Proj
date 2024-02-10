// Import the 'dotenv' library to manage environment variables
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Import the MongoClient from the 'mongodb' library
const MongoClient = require('mongodb').MongoClient;

// Variable to store the database connection
let _db;

// Function to initialize the database connection
const initDb = (callback) => {
  // Check if the database is already initialized
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }

  // Connect to the MongoDB using the provided URI from the environment variables
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      // Store the database connection in the _db variable
      _db = client;

      // Call the callback function with the initialized database connection
      callback(null, _db);
    })
    .catch((err) => {
      // Call the callback function with the error if connection fails
      callback(err);
    });
};

// Function to get the initialized database connection
const getDb = () => {
  // Check if the database is not initialized, throw an error
  if (!_db) {
    throw Error('Db not initialized');
  }

  // Return the initialized database connection
  return _db;
};

// Export the functions to be used in other modules
module.exports = {
  initDb,
  getDb,
};