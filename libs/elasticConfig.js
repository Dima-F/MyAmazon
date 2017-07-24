module.exports = function(Product){
  //mongoosastic configuration
  Product.createMapping(function(err, mapping) {
    if (err) {
      console.log('Error creating mapping');
      console.log(err);
    } else {
      console.log('Mapping created');
      console.log(mapping);
    }
  });

  var stream = Product.synchronize();
  var count = 0;
  stream.on('data', function() {
    count++;
  });
  stream.on('close', function() {
    console.log('Indexed ' + count + ' documents');
  });
  stream.on('error', function(err) {
    console.log(err);
  });
};
