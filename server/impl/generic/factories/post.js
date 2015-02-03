/**
 * generic/factories/post.js
 *
 * Factory for generic POST handlers.
 */

var mongoose = require('mongoose'),
  _ = require('lodash');

function newHandler(route, Model) {
  return function(req, res) {
    var object = new Model(req.body);

    object.save(function(err) {
      if (err) {
        console.error(err);
        return res.respond({
          status: 500,
          error: 'Internal server error.'
        });
      } else {
        return res.respond({
          content: [object]
        });
      }
    });
  }
}

module.exports = {
  newHandler: newHandler
};
