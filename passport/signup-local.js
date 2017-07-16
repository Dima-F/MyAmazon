var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
	passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true, // allows us to pass back the entire request to the callback
            usernameField: 'email',
  					passportField: 'passport',
        },
        function(req, email, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        return done(null, false, req.flash('message','User Already Exists'));
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
                            if (err) return done(err);
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
};
