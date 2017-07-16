var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name:{type:String, unique:true, lowercase:true}
});
module.exports = mongoose.model('Category',CategorySchema);
