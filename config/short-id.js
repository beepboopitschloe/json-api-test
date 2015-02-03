/**
 * short-id.js
 *
 * Defines the format of a mongoose-shortid so that everything will be
 * unified across the app.
 */

var ShortId = require('mongoose-shortid');

module.exports = {
  type: ShortId,
  len: 7,
  base: 16
};
