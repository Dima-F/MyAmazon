var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
  name:{type:String},
  price:Number,
  image:String
});
module.exports = mongoose.model('Product',ProductSchema);
