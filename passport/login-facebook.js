var FacebookStrategy   = require('passport-facebook').Strategy;
var config = require('../config');
var User = require('../models/user');
var Cart = require('../models/cart');
var async = require('async');

module.exports = function(passport){
	//middleware
	passport.use('facebook-login', new FacebookStrategy(
        config.get('facebook'),
        function(token, refreshToken, profile, done) {
            User.findOne({facebook:profile.id},function(err,user){
              if(err) return done(err);
              if(user){
                return done(null,user);
              } else {
								async.waterfall([
									function(callback){
										var newUser = new User();
		                newUser.email = profile._json.email;
		                newUser.facebook = profile.id;
		                newUser.tokens.push({kind:'facebook', token:token});
		                newUser.profile.name = profile.displayName;
		                newUser.profile.picture = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
		                newUser.save(function(err){
		                  callback(err,newUser);
		                });
									},
									function(newUser,callback){
										var cart = new Cart();
										cart.owner = newUser._id;
										cart.save(function(err){
											callback(err,newUser);
										});
									},
								],function(err,newUser){
									if(err) return done(err);
									console.log('Successfull facebook sign-up!');
					        return done(null, newUser);
								});
              }
            });
        })
    );
};
