  var createError = require('http-errors');
  var express = require('express');
  var nodemailer = require('nodemailer');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  var expressHbs = require('express-handlebars')
  var indexRouter = require('./routes/index');
  var usersRouter = require('./routes/users');
  var mongoose = require('mongoose');
  var session = require('express-session');
  var passport = require('passport');
  var MongoStore = require('connect-mongo')(session);
  var flash = require('connect-flash');
  var validator = require('express-validator');
  var routes = require('./routes/index');
  var userRoutes = require('./routes/user');
  var app = express();


  // view engine setup
  app.engine('.hbs',expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
  app.set('view engine', '.hbs');


  mongoose.connect("mongodb://localhost:27017/people", { useNewUrlParser: true });
  require('./config/passport');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(validator());
  app.use(cookieParser());
  app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 180 * 60 *1000}
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));
  app.listen(process.env.PORT || 8000, process.env.IP || '0.0.0.0' );
  app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
  });
  app.use('/user', userRoutes);
  app.use('/', indexRouter);
  //pp.use('/users', usersRouter);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler#
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
