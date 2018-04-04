const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('./config.js');

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID || config.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET || config.CLIENT_SECRET,
    callbackURL: 'https://blueberry-shortcake-17164.herokuapp.com/login/facebook/return'
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(() => {
      User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.id    = profile.id;
          newUser.token = token;
          newUser.name  = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
const User = require('./models/User.js');
mongoose.connect(config.MONGO_URL);

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

app.get('/login',
  (req, res) => {
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook', {
      scope : ['public_profile', 'email']
    }));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login',
                                      failureFlash: true }));



app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    User.find((err, allUsers) => {
      if (err) {
        res.send('Error: ' + err);
      } else if (allUsers.length === 0) {
        res.send('No other users.');
      } else {
        res.render('profile', {user: req.user, allUsers: allUsers});
      }
    });
  });

app.listen(process.env.PORT || 3000);
