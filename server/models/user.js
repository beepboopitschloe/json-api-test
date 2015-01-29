/**
 * user.js
 *
 * Exports the model for a user.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  username: {
    type: String,
    default: ''
  },
  email: {
    type: String
  },
  passwordHash: {
    type: String
  }
});
