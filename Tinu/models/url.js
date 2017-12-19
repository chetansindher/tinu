var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
   // _id: {type: Number, index: true},
  tinu: String,
  created: Date
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
