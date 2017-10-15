var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var app = express();
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "serlersdm@gmail.com",
        pass: "Serler@123456"
    }
});
app.get('/sendModulator',function(req,res){
    

    var mailOptions={
   to : 'modulatorserler@gmail.com',
   subject : 'Modulation Needed!!',
   text :'Hi Modulator,\n\nNew article has been submitted by a registered user.\n\nThe article needs to modulated within the next 24 Hours.\n\nClick below to modulate the Article.\nLink : http://localhost:3000/modulator\n\nThanks.\n\n\n\n\n\Regards,\nSERLER.'
    }
    
    console.log(mailOptions);
    
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
    console.log(error);
    res.end("error" + to + subject );
    }else{
    window.location = "http://localhost:3000/modulator";
    
    }
    });
    
});

app.get('/sendAnalyst',function(req,res){
    

    var mailOptions={
   to : 'analystserler@gmail.com',
   subject : 'Analysis Needed!!',
   text :'Hi Analyst,\n\nNew article has been submitted by a registered user.\n\nThe article needs to modulated within the next 24 Hours.\n\nClick below to analyze the Article.\nLink : http://localhost:3000/analyst\n\nThanks.\n\n\n\n\n\Regards,\nSERLER.'
    }
    
    console.log(mailOptions);
    
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
    console.log(error);
    res.end("error" + to + subject );
    }else{
    console.log("Message sent: " + response.message);
   res.successRedirect('/loggedin');
    
    }
    });
    
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(port);

module.exports = app;
