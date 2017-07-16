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
//my modules
var config = require('./config');
var attachUser = require('./middlewares/attachUser');
var findCategories = require('./middlewares/findCategories');
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
    store:new MongoStore({url:config.get('mongoose:local'),autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
//use my middlewares
app.use(attachUser);
app.use(findCategories);
//routes
var apiRoutes = require('./api/index');
var mainRoutes = require('./routes/main')();
var userRoutes = require('./routes/user')(passport);
var adminRoutes = require('./routes/admin')();
app.use('/api',apiRoutes);
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);


app.listen(config.get('port'),function(err){
  if(err) throw err;
  console.log('Server running on port '+config.get('port'));
});
