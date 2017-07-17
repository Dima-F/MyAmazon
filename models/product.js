var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var ProductSchema = new mongoose.Schema({
  category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
  name:{type:String},
  price:Number,
  image:String
});

ProductSchema.plugin(mongoosastic, {
  hosts:[
    'localhost:9200'
  ]
});
module.exports = mongoose.model('Product',ProductSchema);
