/**
 * team.js
 *
 * Model for a Team object.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('Team', {
  name: String,
  members: [String]
});
