/**
 * team.js
 *
 * Model for a Team object.
 */

var mongoose = require('mongoose'),
  ShortId = require('../../config/short-id');

module.exports = mongoose.model('Team', {
  _id: ShortId,
  
  name: String
});
