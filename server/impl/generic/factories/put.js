/**
 * generic/factories/put.js
 *
 * Factory for generic PUT handlers.
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

    Model.findOneAndUpdate({
      _id: id
    }, req.body, function(err, data) {
      if (err) {
        console.error(err);
        return res.respond({
          status: 500,
          error: 'Internal server error.'
        });
      } else if (!data) {
        // 404, since the user provided a specific ID and we found nothing
        return res.respond({
          status: 404,
          error: 'Could not find ' + route.model + ' with id ' + id
        });
      } else {
        return res.respond({
          content: [data]
        });
      }
    });
  }
}

module.exports = {
  newHandler: newHandler
};
