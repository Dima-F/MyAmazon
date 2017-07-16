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
    cookie: { maxAge: 60000 },
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
app.use(attachUser);
//routes
var mainRoutes = require('./routes/main')();
var userRoutes = require('./routes/user')(passport);
app.use(mainRoutes);
app.use(userRoutes);


app.listen(config.get('port'),function(err){
  if(err) throw err;
  console.log('Server running on port '+config.get('port'));
});
