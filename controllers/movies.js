// Import the 'mongodb' module for database connection
const mongodb = require('../db/connect');

// Import the 'ObjectId' class from the 'mongodb' library
const ObjectId = require('mongodb').ObjectId;

// Function to get all movies from the database
const getAllMovies = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('movies')
      .find()
      .toArray((err, lists) => {
        if (err) {
          // If an error occurs, send a response with a 500 status code
          console.error(err); // Log the error for debugging purposes
          res.status(500).json({ success: false, error: 'Internal Server Error' });
          return; // Exit the function to prevent further execution
        }
        // If no error occurs, send the retrieved data as JSON response with a 200 status code
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
      });
  } catch (error) {
    // This block won't catch errors from asynchronous operations like MongoDB queries
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Function to get a single movie by ID from the database
const getSingleMovie = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid movie ID.' });
      return;
    }
    const userId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('movies')
      .find({ _id: userId })
      .toArray((err, result) => {
        if (err) {
          res.status(400).json({ error: 'Failed to get movie.' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


// Function to create a new movie in the database
const createMovie = async (req, res) => {
  // Implement logic to create a new movie in the 'movies' collection
  try {
    const movie = {
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      director: req.body.director,
      genre: req.body.genre,
      rating: req.body.rating
    };

    const response = await mongodb.getDb().db().collection('movies').insertOne(movie);

    if (response.acknowledged) {
        res.status(201).json({
          success: true,
          movie: movie, // Return the inserted movie data
          message: 'Movie created successfully.'
        });
      } else {
        console.error('Failed to insert movie. MongoDB response:', response);
        res.status(500).json({
          success: false,
          error: 'Failed to insert movie.'
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
const updateMovie = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid movie ID.' });
    return;
  }
  // Implement logic to update an existing movie in the 'movies' collection
  const movieId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const movie = {
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    genre: req.body.genre,
    rating: req.body.rating
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('movies')
    .replaceOne({ _id: movieId }, movie);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the movie.');
  }
};

// Function to delete a movie from the database
const deleteMovie = async (req, res) => {
  // Implement logic to delete a movie from the 'movies' collection
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid movie ID.' });
      return;
    }
    const movieId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId });

    console.log(response);
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the movie.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Export the functions to be used in other modules
module.exports = { getAllMovies, getSingleMovie, createMovie, updateMovie, deleteMovie };