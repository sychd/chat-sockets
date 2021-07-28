var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/chat';
var Schema = mongoose.Schema;
var connection = mongoose.createConnection(url);

module.exports = connection;