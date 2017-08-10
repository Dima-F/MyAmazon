var mongoose = require('mongoose');
//var mongoosastic = require('mongoosastic');

var ProductSchema = new mongoose.Schema({
  category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
  name:{type:String},
  price:Number,
  image:String
});
//creating index for full text search
ProductSchema.index({'category':'text','name':'text'});
/*ProductSchema.plugin(mongoosastic, {
  hosts:[
    'localhost:9200'
  ]
});*/
module.exports = mongoose.model('Product',ProductSchema);
