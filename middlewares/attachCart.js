var Cart = require('../models/cart');

module.exports = function(req,res,next){
  if(req.user){
    var total = 0;
    Cart.findOne({owner:req.user._id},function(err,cart){
      if(cart){
        cart.items.forEach(function(item){
          total+=item.quantity;
        });
        res.locals.cart = total;
      } else {
        res.locals.cart = 0;
      }
      next();
    });
  } else {
    next();
  }
};
