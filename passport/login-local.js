var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
	//middleware
	passport.use('local-login', new LocalStrategy({
					usernameField: 'email',
					passportField: 'passport',
					passReqToCallback: true
        },
        function(req, email, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({ 'email' :  email },
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        return done(null, false, req.flash('loginMessage', "User not found!"));
                    }
                    // User exists but wrong password, log the error
										if (!user.comparePassword(password)) {
								      return done(null, false, req.flash('loginMessage', "Wrong password!"));
								    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );
        })
    );
};
