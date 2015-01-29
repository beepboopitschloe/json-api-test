/**
 * generic/urlParam.js
 *
 * Factory function for generic url parameter handlers.
 */

var mongoose = require('mongoose');

exports = module.exports = function(route, param) {
  param = param || {};

  var modelName = route.model || '',
    mapsToField = param.mapsToField || '_id',
    Model = null;

  if (!modelName) {
    // @TODO better error message
    throw new Error('Expected model definition, got undefined.');
  } else {
    // get model definition
    Model = mongoose.model(modelName);
  }

  return function(req, res, next, paramVal) {
    req.urlParams.add(modelName, paramVal);

    var query = {};
    query[mapsToField] = paramVal;

    Model.find(query, function(err, data) {
      if (err) {
        return next(err);
      } else {
        req.urlParams.resolve(modelName, data);

        return next();
      }
    })
  }
}
