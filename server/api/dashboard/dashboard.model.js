'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  id: Number,
  question: String,
  pollOptions: Array
});

module.exports = mongoose.model('Poll', PollSchema);