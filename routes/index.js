var express = require('express');
var passport = require('passport');
var nodemailer = require('nodemailer');

var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Serler' });
});


router.get('/signup', function(req, res, next) {
  res.render('create.ejs', { message: req.flash('signupMessage') });
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/create', function(req, res) {
  res.render('create.ejs', { message: req.flash('signupMessage') });
 
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', { user: req.user });
});

router.get('/accountcreated', isLoggedIn, function(req, res) {
  res.render('accountcreated.ejs', { user: req.user });
// Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      nodemailer.createTestAccount((err, account) => {

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
              host: 'sub5.mail.dreamhost.com',
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                  user: "justin@webappcreator.net", // generated ethereal user
                  pass: "4fa#149o0SPXEhp^ZFs"  // generated ethereal password
              }
          });

          // setup email data with unicode symbols
          let mailOptions = {
              from: '"Serler Server" <justin@webappcreator.net>', // sender address
              to: req.user.local.email , // list of receivers
              subject: 'Verification email... ', // Subject line
              text: 'Hi Serler User', // plain text body
              html: 'Click the following email to verify your account: <a href="http://localhost:3000/"> link</a><br><br>Thanks,<br>The Serler Team' // html body
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          });
      });

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
  successRedirect: '/accountcreated',
  failureRedirect: '/create',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/loggedin',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

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


