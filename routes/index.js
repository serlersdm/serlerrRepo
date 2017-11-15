var express = require('express');
var passport = require('passport');


var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Serler' });
});


router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/create', function(req, res) {
  res.render('create.ejs', { message: req.flash('signupMessage') });
});

router.get('/modulator', function(req, res) {
  res.render('modulator.ejs', { message: req.flash('signupMessage') });
});
router.get('/analyst', function(req, res) {
  res.render('analyst.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/welcome', isLoggedIn, function(req, res) {
  res.render('welcome.ejs', { user: req.user });
});
router.get('/loggedin', isLoggedIn, function(req, res) {
  res.render('loggedin.ejs', { user: req.user });
});
router.get('/logout', function(req, res, next) {
  res.render('logout.ejs', { title: 'Serler' });
});
router.get('/logout',  function(req, res, next) {
        res.clearCookie(); 
        req.logOut();
        req.session.destroy();
    res.render('index', { title: 'Serler' });

});


router.post('/create', passport.authenticate('local-signup', {
  successRedirect: '/loggedin',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/loggedin',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/loggedin',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/loggedin',
  failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/loggedin',
  failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}


