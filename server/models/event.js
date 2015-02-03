/**
 * event.js
 *
 * Model an Event object, which contains a date and a list of teams.
 */

var mongoose = require('mongoose'),
  ShortId = require('../../config/short-id');

module.exports = mongoose.model('Event', {
  _id: ShortId,
  
  date: Date,
  teams: [String]
});
