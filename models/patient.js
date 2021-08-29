var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  ppsNumber: {type: String, required: true},
  email: {type: String, required: true},
  Age: {type: Number, required: true},
  spo2: [{type: Number, required: false}],
  bpm: [{type: Number, required: false}],
  imgPath: {type: String, required: true}

});

module.exports = mongoose.model('Patient',schema);
