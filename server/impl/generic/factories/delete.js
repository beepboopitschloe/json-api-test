/**
 * generic/factories/delete.js
 *
 * Factory for generic DELETE handlers.
 */

var mongoose = require('mongoose'),
  _ = require('lodash');

function newHandler(route, Model) {
  return function(req, res) {
    var id;

    if (req.urlParams.has(route.model)) {
      id = req.urlParams.get(route.model).param.value;
    } else {
      id = req.body._id;
    }

    if (!id) {
      return res.respond({
        status: 400,
        error: 'Missing required parameter _id.'
      });
    }

    Model.findOneAndRemove({
      _id: id
    }, function(err, data) {
      if (err) {
        return res.respond({
          status: 500,
          error: 'Internal server error.'
        });
      } else {
        return res.respond({
          message: 'Removed successfully.',
          content: [data]
        });
      }
    });
  }
}

module.exports = {
  newHandler: newHandler
}
