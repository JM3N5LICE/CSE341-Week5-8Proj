const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const { auth } = require('express-openid-connect');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://cse341movie.onrender.com',
  clientID: 'vRRJlC66eWClO5HvLe0DFzpFTCTpd255',
  issuerBaseURL: 'https://dev-gm1z4qm5wulqlarf.us.auth0.com'
};

app.use(auth(config));

// Middleware function to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    // If authenticated, proceed to the next middleware
    next();
  } else {
    // If not authenticated, redirect to the login view
    res.redirect('/login');
  }
};

// Route handler for the root URL (/)
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Your App!</h1>
    <p>Please <a href="/login">log in</a> to access the content.</p>
  `);
});

// Route handler for the login view
app.get('/login', (req, res) => {
  res.send('This is the login view.');
});

// Route handler for the authenticated content
app.get('/dashboard', checkAuth, (req, res) => {
  // Display additional content for authenticated users
  res.send(`
    <h1>Welcome, ${req.oidc.user.name}!</h1>
    <p>You are logged in.</p>
    <p><a href="/api-docs">Go to Swagger page (API Docs)</a></p>
    <p><a href="/render">Go to Render page</a></p>
  `);
});

app.use('/', require('./routes'));

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});