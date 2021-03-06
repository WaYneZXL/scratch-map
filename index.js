const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
// const LocalStrategy = require('passport-local').Strategy;
const config = require('./config.js');
const User = require('./models/User.js');
const Post = require('./models/Post.js');

const app = express();

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
mongoose.connect(config.MONGO_URL);

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID || config.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET || config.CLIENT_SECRET,
    callbackURL: 'https://blueberry-shortcake-17164.herokuapp.com/login/facebook/return'
  },
  (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ 'facebookId' : profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.facebookId    = profile.id;
          newUser.token = token;
          newUser.name  = profile.displayName;
          if (profile.emails) {
            newUser.email = profile.emails[0].value;
          }
          newUser.save(function(err) {
            if (err) {
              res.send('Error: ' + err);
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use(passport.initialize());
app.use(passport.session());


app.get('/',
  (req, res) => {
    Post.find((err, allPosts) => {
      if (err) {
        res.send('Error: ' + err);
      } else if (allPosts.length === 0) {
        res.send('No posts.');
      } else {
        res.render('home', {user: req.user, allPosts: allPosts });
      }
    });
  });

app.post('/',
  (req, res) => {
    const newPost = new Post;
    newPost.userId = req.user.id;
    newPost.post = req.body.post;
    newPost.location = req.body.location;
    newPost.save((err) => {
      if (err) {
        res.send('Error: ' + err);
      }
      Post.find((err, allPosts) => {
        if (err) {
          res.send('Error: ' + err);
        } else if (allPosts.length === 0) {
          res.send('No posts.');
        } else {
          res.render('home', {user: req.user, allPosts: allPosts });
        }
      });
    });
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
