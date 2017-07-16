var Category = require('../models/category');
module.exports = function(req, res, next){
  Category.find({},function(err, categories){
    if(err) next(err);
    res.locals.categories = categories;
    next();
  });
};
