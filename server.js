var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');//for templating ejs
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var app = express();
//mongoose connecting
require('./libs/mongoose');
//middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: config.get('session:secret'),
    store:new MongoStore({url:config.get('mongoose:local'),autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//views
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
//routes
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);


app.listen(config.get('port'),function(err){
  if(err) throw err;
  console.log('Server running on port '+config.get('port'));
});
