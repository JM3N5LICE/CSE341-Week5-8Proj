// Import the 'mongodb' module for database connection
const mongodb = require('../db/connect');

// Import the 'ObjectId' class from the 'mongodb' library
const ObjectId = require('mongodb').ObjectId;

// Function to get all contacts from the database
const getAll = async (req, res, next) => {
  // Use the 'find' method to get all documents from the 'contacts' collection
  const result = await mongodb.getDb().db().collection('contacts').find();

  // Convert the result to an array and send it as a JSON response
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Function to get a single contact by ID from the database
const getSingle = async (req, res, next) => {
  // Create an ObjectId from the request parameter 'id'
  const userId = new ObjectId(req.params.id);

  // Use the 'find' method to get a document with the specified ID from the 'contacts' collection
  const result = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .find({ _id: userId });

  // Convert the result to an array and send the first element as a JSON response
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createContact = async (req, res, next) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({
        success: true,
        contact: response.ops[0],
        message: 'Contact created successfully.'
      });
    } else {
      console.error('Failed to insert contact. MongoDB response:', response);
      res.status(500).json({
        success: false,
        error: response.error || 'Some error occurred while creating the contact.'
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

const updateContact = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

const deleteContact = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('contacts').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};

// Export the functions to be used in other modules
module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
