var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');//for templating ejs
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var passport = require('passport');
var path = require('path');
var MongoStore = require('connect-mongo')(session);
//my modules & middlewares
var config = require('./config');
var attachUser = require('./middlewares/attachUser');
var findCategories = require('./middlewares/findCategories');
var attachCart = require('./middlewares/attachCart');
require('./libs/mongoose');//mongoose connecting

var app = express();

//middlewares
//views
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    resave: 'true',
    secret: config.get('session:secret'),
    store:new MongoStore({url:config.get('mongoose:remote'),autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
//use custom middlewares
app.use(attachUser);
app.use(attachCart);
app.use(findCategories);
//routes
var apiRoutes = require('./api')();
var mainRoutes = require('./routes/main')();
var userRoutes = require('./routes/user')(passport);
var adminRoutes = require('./routes/admin')();
app.use('/api',apiRoutes);
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if(!err.status){
    err.status=500;
  }
  res.locals.error = req.app.get('env') === 'development' ? err :
  {
    message:err.message,
    status:err.status,
    stack:'Relax and have fun &#9749;'
  };

  // render the error page
  res.status(err.status);
  res.render('error');
  console.error(err);
});

app.listen(config.get('port'),function(err){
  if(err) throw err;
  console.log('Server running on port '+config.get('port'));
});
