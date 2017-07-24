var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var elasticConfig = require('../libs/elasticConfig');
var stripe = require('stripe')('sk_test_kTg6IafxY2wEljjiWCGKX9E1');

//Elastic search configuration
elasticConfig(Product);

function paginate(req, res, next) {
  var perPage = 9;
  var page = req.params.page;
  Product
    .find({})
    .skip(perPage * page)
    .limit(perPage)
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      Product.count().exec(function(err, count) {
        if (err) return next(err);
        res.render('main/product-main', {
          products: products,
          pages: count / perPage
        });
      });
    });
}

//routes
module.exports = function() {
  router.get('/', function(req, res, next) {
    if (!req.user) {
      res.render('main/home');
    } else {
      paginate(req, res, next);
    }
  });
  router.get('/page/:page', function(req, res, next) {
    paginate(req, res, next);
  });
  router.get('/about', function(req, res, next) {
    res.render('main/about');
  });
  router.get('/products/:id', function(req, res, next) {
    Product
      .find({
        category: req.params.id
      })
      .populate('category')
      .exec(function(err, products) {
        if (err) return next(err);
        res.render('main/category', {
          products: products
        });
      });
  });

  router.get('/product/:id', function(req, res, next) {
    Product.findById({
      _id: req.params.id
    }, function(err, product) {
      if (err) return next(err);
      res.render('main/product', {
        product: product
      });
    });
  });
  router.post('/product/:id',function(req,res,next){
    Cart.findOne({owner:req.user._id}, function(err,cart){
      if(err) return next(err);
      cart.items.push({
        item:req.body.product_id,
        price:parseFloat(req.body.priceValue),
        quantity:parseInt(req.body.quantity)
      });
      cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
      cart.save(function(err){
        if(err) return next(err);
        return res.redirect('/cart');
      });
    });
  });
  //search routes...
  router.post('/search', function(req, res, next) {
    res.redirect('/search?q=' + req.body.q);
  });
  router.get('/search', function(req, res, next) {
    Product.search({
        query_string: {
          query: req.query.q
        }
      },
      function(err, results) {
        if (err) return next(err);
        var data = results.hits.hits.map(function(hit) {
          return hit;
        });
        res.render('main/search-result', {
          query: req.query.q,
          data: data
        });
      });
  });
  router.get('/cart',function(req,res,next){
    Cart
      .findOne({owner:req.user._id})
      .populate('items.item')
      .exec(function(err,cart){
        if(err) return next(err);
        res.render('main/cart',{
          shoppingCart:cart,
          message:req.flash('remove')
        });
      });
  });
  router.post('/remove',function(req,res,next){
    Cart.findOne({owner:req.user._id},function(err, foundCart){
      if(err) return next(err);
      foundCart.items.pull(String(req.body.itemId));
      foundCart.total = (foundCart.total-parseFloat(req.body.price)).toFixed(2);
      foundCart.save(function(err){
        if(err) return next(err);
        req.flash('remove','Successfully removed');
        res.redirect('/cart');
      });
    });
  });

  router.post('/payment',function(req,res,next){
    var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.customers.create({
      source:stripeToken
    }).then(function(customer){
      return stripe.charges.create({
        amount:currentCharges,
        currency:'usd',
        customer:customer.id
      });
    });
    res.redirect('/profile');
  });
  return router;
};
