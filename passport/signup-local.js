var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Cart = require('../models/cart');
var async = require('async');

module.exports = function(passport) {
  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true, // allows us to pass back the entire request to the callback
      usernameField: 'email',
      passportField: 'passport',
    },
    function(req, email, password, next) {
      async.waterfall([
        function(callback) {
          // find a user in Mongo with provided username
          User.findOne({
            'email': email
          }, function(err, user) {
            if (err) {
              console.log('Error in SignUp: ' + err);
              callback(err);
            } else {
              // already exists ???can we return main callback from this section???
              if (user) {
                return next(null, false, req.flash('message', 'User Already Exists'));
              } else {
                // if there is no user with that email
                // create the user
                var newUser = new User();
                // set the user's local credentials
                newUser.profile.name = req.body.name;
                newUser.password = req.body.password;
                newUser.email = req.body.email;
                newUser.profile.picture = newUser.gravatar();
                // save the user
                newUser.save(function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, newUser);
                  }
                });
              }
            }
          });
        },
        function(user, callback) {
          var cart = new Cart();
          cart.owner = user._id;
          cart.save(function(err) {
            if (err){
							callback(err);
						} else {
							callback(null, user);
						}
          });
        }
      ], function(err, user) {
        if (err) return next(err);
        console.log('Successfull user registration!');
        return next(null, user);
      });
    }));
};
