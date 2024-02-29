const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const { auth } = require('express-openid-connect');

// Set the port for the server to either the environment variable PORT or 8080
const port = process.env.PORT || 8080;

// Create an Express application
const app = express();

// Use 'bodyParser.json()' middleware to parse incoming JSON request bodies
// Set up CORS (Cross-Origin Resource Sharing) by adding a middleware that sets the 'Access-Control-Allow-Origin' header to '*'
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Configure authentication
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:8080',
  clientID: 'vRRJlC66eWClO5HvLe0DFzpFTCTpd255',
  issuerBaseURL: 'https://dev-gm1z4qm5wulqlarf.us.auth0.com'
};

// Use auth middleware
app.use(auth(config));

// Define a route to handle requests to the root URL (/)
app.get('/', (req, res) => {
  // Display a welcome message and links to other routes
  res.send(`
    <h1>Welcome!</h1>
    <p>You are logged in.</p>
    <p><a href="/api-docs">Go to Swagger page (API Docs)</a></p>
    <p><a href="/render">Go to Render page</a></p>
  `);
});

// Define a route to handle redirection after login
app.get('/callback', (req, res) => {
  // Redirect user to Swagger page (/api-docs) after login
  res.redirect('/api-docs');
});

// Include the routes defined in the 'routes' module
app.use('/', require('./routes'));

// Initialize the database connection and start the server
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    // If the database connection is successful, start the server and log a message
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});