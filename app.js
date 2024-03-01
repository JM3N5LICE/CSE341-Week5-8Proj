// Import the 'express' module for creating the web server
const express = require('express');
// Import the 'body-parser' middleware to parse incoming request bodies
const bodyParser = require('body-parser');
// Import the 'mongodb' module for database connection
const mongodb = require('./db/connect');
const { auth } = require('express-openid-connect');

// Set the port for the server to either the environment variable PORT or 8080
const port = process.env.PORT || 8080;

// Create an Express application
const app = express();

// Use 'bodyParser.json()' middleware to parse incoming JSON request bodies
// Set up CORS (Cross-Origin Resource Sharing) by adding a middleware that sets the 'Access-Control-Allow-Origin' header to '*'
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  // Include the routes defined in the 'routes' module
  .use('/', require('./routes'));

  const { auth } = require('express-openid-connect');

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'https://cse341movie.onrender.com',
    clientID: 'vRRJlC66eWClO5HvLe0DFzpFTCTpd255',
    issuerBaseURL: 'https://dev-gm1z4qm5wulqlarf.us.auth0.com'
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

// Initialize the database connection and start the server
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    // If the database connection is successful, start the server and log a message
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});