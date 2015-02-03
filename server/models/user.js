/**
 * user.js
 *
 * Exports the model for a user.
 */

var mongoose = require('mongoose'),
  ShortId = require('../../config/short-id');

module.exports = mongoose.model('User', {
  _id: ShortId,

  username: {
    type: String,
    default: ''
  },
  email: {
    type: String
  },
  passwordHash: {
    type: String
  },
  teamId: {
    type: ShortId
  }
});
