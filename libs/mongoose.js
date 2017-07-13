var mongoose = require("mongoose");
var config = require('./../config');

mongoose.connect(config.get('mongoose:local'),function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Connected to mongoose succesfully');
  }
});

module.exports = mongoose;
