var router = require('express').Router();
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
};

module.exports = function(passport){
  /* GET login page. */
  router.get('/login',function(req,res){
    if(req.user) return res.redirect('/');
    res.render('accounts/login',{message:req.flash('loginMessage')});
  });
  /* Handle Login POST */
  router.post('/login',passport.authenticate('local-login',{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
  }));
  /* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('accounts/signup',{message: req.flash('message')});
	});
  /* Handle Registration POST */
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash : true
	}));
  /* GET profile Page */
  router.get('/profile', isAuthenticated, function(req, res){
		res.render('accounts/profile', { user: req.user });
	});
  /* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
  return router;
};
