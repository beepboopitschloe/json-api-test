/**
 * event.js
 *
 * Model an Event object, which contains a date and a list of teams.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('Event', {
  date: Date,
  teams: [String]
});
