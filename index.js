const express = require('express');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

// Import configuration
const config = require('./config.js');

// Import models


// Import controllers

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: process.env.CLIENT_ID || config.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET || config.CLIENT_SECRET,
    callbackURL: 'https://blueberry-shortcake-17164.herokuapp.com/login/facebook/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.

    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Connect with database
const mongoose = require('mongoose');
const Person = require('./models/Person.js');
mongoose.connect(config.MONGO_URL);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

app.get('/login',
  (req, res) => {
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login',
                                      failureFlash: true }));

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    Person.find((err, allPersons) => {
      if (err) {
        res.send('Error: ' + err);
      } else if (allPersons.length === 0) {
        res.send('No other users.');
      } else {
        res.render('profile', {user: req.user, allPersons: allPersons});
      }
    });
  });

app.get('/:name', (req, res) => {
  const newPerson = new Person({
    name: req.params.name
  });
  newPerson.save((err) => {
    if (err) {
      res.send('Error: ' + err);
    }
  });
  res.redirect('/profile');
});

app.listen(process.env.PORT || 3000);
