var mongoose = require("mongoose");
var config = require('./../config');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var connection = mongoose.connect(config.get('mongoose:remote'), options).connection;

connection.on('error', function(err) { console.log(err.message); });
connection.once('open', function() {
  console.log("mongodb connection open");
});
module.exports = mongoose;
