const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');

// Route to handle the login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Route to handle form submission for login
router.post('/login', (req, res, next) => {
  // You can implement your custom authentication logic here for username/password login
});

// Route to initiate Google OAuth login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or to a designated route
    res.redirect('/');
  });

module.exports = router;