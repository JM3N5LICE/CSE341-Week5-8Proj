// Import the 'mongodb' module for database connection
const mongodb = require('../db/connect');

// Import the 'ObjectId' class from the 'mongodb' library
const ObjectId = require('mongodb').ObjectId;

// Function to get all movies from the database
const getAllUsers = async (req, res) => {
  try{
    mongodb
      .getDb()
      .db()
      .collection('users')
      .find()
      .toArray((err, lists) => {
        if (err) {
          res.status(400).json({ message: err});
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get a single movie by ID from the database
const getSingleUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID'});
    }
    const userId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('users')
      .find({ _id: userId })
      .toArray((err, result) => {
        if (err) {
          res.status(400).json({ message: err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to create a new movie in the database
const createUser = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const user = {
      name: name,
      likedMovies: req.body.likedMovies || [], // Generate empty array if not provided
      groups: req.body.groups || [] // Generate empty array if not provided
    };

    const response = await mongodb.getDb().db().collection('users').insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        user: user,
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

// Function to update an existing user in the database
const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const user = {
      name: name,
      likedMovies: req.body.likedMovies || [], // Generate empty array if not provided
      groups: req.body.groups || [] // Generate empty array if not provided
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a user from the database
const deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid user ID.' });
    }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(400).json({ error: 'User not found' }); // Update error message for user not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Generic error message for server errors
  }
};

// Export the functions to be used in other modules
module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };