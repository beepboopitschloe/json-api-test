/**
 * generic/handler.js
 *
 * Generic handler factory.
 */

var mongoose = require('mongoose'),
  _ = require('lodash'),
  getFactory = require('./factories/get'),
  postFactory = require('./factories/post'),
  putFactory = require('./factories/put'),
  deleteFactory = require('./factories/delete');

exports = module.exports = function(route, method) {
  // need to get the referenced model so that we can pass it to the handler
  // factory methods
  var modelName = route.model || '',
    Model = null;

  // route return/manipulation type defaults to its model type
  route.manipulates = route.manipulates || route.model;

  if (!modelName) {
    // @TODO better error message
    throw new Error('Expected model definition, got undefined.');
  } else {
    // get model definition
    try {
      Model = mongoose.model(modelName);
    } catch (e) {
      // an error here means that the schema is not registered.
      // check the references list to see if we're using a reference name
      // instead of an object schema.
      var ref = _.findWhere(route.references, {as: modelName});

      if (ref) {
        Model = mongoose.model(ref.model);
      } else {
        throw e;
      }
    }
  }

  switch (method.method) {
    case 'GET':
      return getFactory.newHandler(route, Model);
    case 'POST':
      return postFactory.newHandler(route, Model);
    case 'PUT':
      return putFactory.newHandler(route, Model);
    case 'DELETE':
      return deleteFactory.newHandler(route, Model);
    default:
      throw new TypeError('Unsupported method ' + method.method);
  }
}
