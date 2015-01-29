/**
 * generic/handler.js
 *
 * Generic handler factory.
 */

var mongoose = require('mongoose'),
  _ = require('lodash');

exports = module.exports = function(config) {
  config = config || {};

  var method = config.method || 'GET',
    modelName = config.model || '',
    Model = null;

  if (!modelName) {
    // @TODO better error message
    throw new Error('Expected model definition, got undefined.');
  } else {
    // get model definition
    Model = mongoose.model(modelName);
  }

  if (method === 'GET') {
    return function(req, res) {
      if (req.urlParams.has(modelName)) {
        // if we already have an object from the URL params, assume that that's
        // what we want to return 
        var param = req.urlParams.get(modelName);
        
        if (param.data) {
          var content;

          if (!_.isArray(param.data)) {
            content = [param.data];
          } else {
            content = param.data;
          }

          return res.respond({
            content: content
          });
        } else {
          // since there is an explicit ID and not a search, we want to 404 if
          // nothing gets found
          return res.respond({
            status: 404,
            error: 'Could not find ' + modelName
              + ' with id ' + param.param.value + '.'
          });
        }
        return res.respond({
          content: [req.urlParams[modelName]]
        });
      } else {
        // otherwise we need to actually look things up
        
        // automatically apply query params to search
        Model.find(req.query, function(err, data) {
          if (err) {
            console.error(err);

            return res.respond({
              status: 500,
              error: 'Internal server error.'
            });
          } else {
            return res.respond({
              content: data
            });
          }
        });
      }
    } 
  } else if (method === 'POST') {
    return function(req, res) {
      console.log('generic post');

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
  } else if (method === 'PUT') {
    return function(req, res) {
      var id;

      if (req.urlParams.has(modelName)) {
        id = req.urlParams.get(modelName).param.value;
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
            error: 'Could not find ' + modelName + ' with id ' + id
          });
        } else {
          return res.respond({
            content: [data]
          });
        }
      });
    }
  } else if (method === 'DELETE') {
    return function(req, res) {
      var id;

      if (req.urlParams.has(modelName)) {
        id = req.urlParams.get(modelName).param.value;
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
}
