const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Profile = require('../models/profile'); // Import the Profile model

router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    user: req.user 
  });
});

router.post('/register', (req, res) => {
  // use passport local to try creating a new user w/hashed pw
  User.register(new User({ username: req.body.username }), req.body.password, async (err, newUser) => {
    if (err) {
      console.log(err);
      return res.render('auth/register');
    } else {
      // Create a new Profile for the new user
      try {
        await Profile.create({ user: newUser._id });

        // Log in the user
        req.login(newUser, (err) => {
          if (err) {
            console.log(err);
            return res.redirect('/auth/login');
          }
          // Redirect to the edit-profile page to complete profile setup
          return res.redirect('/profile/edit-profile');
        });
      } catch (error) {
        console.error('Error creating profile:', error);
        res.render('error', { message: 'Error creating profile. Please try again.' });
      }
    }
  });
});

router.get('/login', (req, res) => {
  // get any err messages from session
  let messages = req.session.messages || [];
  
  // clear out session error messages
  req.session.messages = [];

  res.render('auth/login', { 
    title: 'Login',
    messages: messages,
    user: req.user
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth/login'); // Redirect on failure
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Log the user ID after successful login
      console.log('User logged in:', user._id);

      // Redirect to posts or user's profile
      return res.redirect('/posts');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.session.messages = [];
  req.logout((err) => {
    res.redirect('/');
  });
});

router.get('/unauthorized', (req, res) => {
  res.render('auth/unauthorized', {
    title: 'Unauthorized',
    user: req.user
  });
});

module.exports = router;
