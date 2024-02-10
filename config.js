// config.js

// Load environment variables from .env file during local development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  module.exports = {
    mongoURI: process.env.MONGODB_URI,
    // Add other configuration variables here
  };