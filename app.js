const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const { auth, requiresAuth } = require('express-openid-connect');

const port = process.env.PORT || 8080;
const app = express();

// Authentication middleware setup
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.CLIENT_SECRET,
  baseURL: 'https://cse341movie.onrender.com',
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Use auth middleware
app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Define a route to handle requests to the root URL (/)
// app.get('/', (req, res) => {
//   // Display a welcome message and links to other routes
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
//     <h1>Welcome!</h1>
//     <p>You are logged in.</p>
//     <p><a href="/api-docs">Go to Swagger page (API Docs)</a></p>
//     <p><a href="/render">Go to Render page</a></p>un
//   `);
// });

// Define a route to handle redirection after login
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Middleware to parse incoming JSON request bodies
app.use(bodyParser.json());



// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
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