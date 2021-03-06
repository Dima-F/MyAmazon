var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* user schema */
var UserSchema = new  Schema({
  email:{type:String, unique:true, lowercase:true, required:true},
  password:{type:String},
  facebook:String,
  tokens:Array,
  profile:{
    name:{type:String, default:''},
    picture:{type:String, default:''},
    address:{type:String, default:''},
  },
  history:[{
    paid:{type:Number, default:0},
    item:{ type:Schema.Types.ObjectId, ref:'Product'}
  }]
});

/*save pass before db saving*/
UserSchema.pre('save',function(next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  } else {
    bcrypt.genSalt(10,function(err,salt){
      if(err) return next(err);
      bcrypt.hash(user.password,salt,null,function(err,hash){
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

/*compare password in db*/
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.gravatar = function(size){
  if(!this.size) size=200;
  if(!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=mm';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '/?s=' + size + '&d=monsterid';
};

module.exports = mongoose.model('User',UserSchema);
