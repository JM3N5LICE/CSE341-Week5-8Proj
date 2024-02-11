// Import the 'mongodb' module for database connection
const mongodb = require('../db/connect');

// Import the 'ObjectId' class from the 'mongodb' library
const ObjectId = require('mongodb').ObjectId;

// Function to get all movies from the database
const getAllUsers = async (req, res, next) => {
    // Use the 'find' method to get all documents from the 'contacts' collection
    const result = await mongodb.getDb().db().collection('users').find();
  
    // Convert the result to an array and send it as a JSON response
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

// Function to get a single movie by ID from the database
const getSingleUser = async (req, res, next) => {
  // Implement logic to get a single movie by ID from the 'movies' collection
  // Create an ObjectId from the request parameter 'id'
  const userId = new ObjectId(req.params.id);

  // Use the 'find' method to get a document with the specified ID from the 'contacts' collection
  const result = await mongodb
    .getDb()
    .db()
    .collection('users')
    .find({ _id: userId });

  // Convert the result to an array and send the first element as a JSON response
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Function to create a new movie in the database
const createUser = async (req, res, next) => {
  // Implement logic to create a new movie in the 'movies' collection
  try {
    const user = {
      name: req.body.name,
      likedMovies: req.body.likedMovies,
      groups: req.body.groups
    };

    const response = await mongodb.getDb().db().collection('users').insertOne(user);

    if (response.acknowledged) {
        res.status(201).json({
          success: true,
          user: user, // Return the inserted movie data
          message: 'User created successfully.'
        });
      } else {
        console.error('Failed to insert user. MongoDB response:', response);
        res.status(500).json({
          success: false,
          error: 'Failed to insert user.'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }
};

// Function to update an existing movie in the database
const updateUser = async (req, res, next) => {
  // Implement logic to update an existing movie in the 'movies' collection
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const user = {
    name: req.body.name,
    likedMovies: req.body.likedMovies,
    groups: req.body.groups
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('users')
    .replaceOne({ _id: userId }, user);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

// Function to delete a movie from the database
const deleteUser = async (req, res, next) => {
  // Implement logic to delete a movie from the 'movies' collection
  const movieId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId });

  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

// Export the functions to be used in other modules
module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };