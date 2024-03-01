const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const { auth } = require('express-openid-connect');

const port = process.env.PORT || 8080;
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(bodyParser.json());

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Authentication middleware setup
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

// Routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Include the routes defined in the 'routes' module
app.use('/', require('./routes'));

// Initialize the database connection and start the server
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});