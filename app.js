require('dotenv').config(); // Load environment variables from .env file

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const authRoutes = require('./routes/authRoutes');

// Initialize Express application
const app = express();

// Set up body parser and CORS
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Verify user profile or create a new user in your database
    // For example:
    // User.findOrCreate({ googleId: profile.id }, (err, user) => {
    //   return done(err, user);
    // });
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or to a designated route
    res.redirect('/');
  });

// Use the auth routes
app.use('/', authRoutes);

// Example protected route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/login');
  }
});

// Import routes module and MongoDB initialization
const mongodb = require('./db/connect');
app.use('/', require('./routes'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize MongoDB connection and start the server
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    // If the database connection is successful, start the server and log a message
    const port = process.env.PORT || 8080;
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});