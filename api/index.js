var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

module.exports = function() {
  router.get('/:name', function(req, res, next) {
    async.waterfall([
      function(callback) {
        Category.findOne({
          name: req.params.name
        }, function(err, category) {
          if(!category){
            callback(new Error());
          } else {
            if(err){
              callback(err);
            } else {
              callback(null,category);
            }
          }
        });
      },
      function(category, callback) {
        for (var i = 0; i < 30; i++) {
          var product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();
          product.save();
        }
        callback(null,'Success!');
      }
    ],function(err,result){
      if(err){
        return res.json({
          message:'Some error occured!'
        });
      } else {
        return res.json({
          message: result,
        });
      }
    });
  });

  router.post('/search', function(req, res, next) {
    console.log(req.body.search_term);
    /*Product.search({
      query_string: {
        query: req.body.search_term
      }
    }, function(err, results) {
      if (err) return next(err);
      res.json(results);
    });*/
    Product.find({$text:{$search:req.body.search_term}},{score:{$meta:'textScore'}})
      .sort({score:{$meta:'textScore'}})//sorting by relevant match
      .populate('category')
      .exec(function(err,results){
        if (err) return next(err);
        res.json(results);
      });
  });
  return router;
};
