/**
 * generic/handler.js
 *
 * Generic handler factory.
 */

var mongoose = require('mongoose'),
  _ = require('lodash');

exports = module.exports = function(route, method) {
  // variables to hold the model for our return type
  var modelName = route.model || '',
    Model = null;

  // flag which tells us whether or not we have already found a return point
  var returned = false;

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

  if (method.method === 'GET') {
    return function(req, res) {
      // first, check if we have a URL parameter that corresponds to our return
      // type.
      // @TODO implement referencing here?
      if (req.urlParams.has(route.manipulates)) {
        // return this data
        var param = req.urlParams.get(route.manipulates);

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
            error: 'Could not find ' + route.manipulates
              + ' with id ' + param.param.value + '.'
          });
        }
      }

      // next, process references and check if we're meant to return any of
      // those.
      // @TODO implement references which depend on other references. currently
      // can only depend on URL parameters
      _.each(route.references, function(reference) {
        if (route.manipulates === reference.model
            || route.manipulates === reference.as) {
          var param = req.urlParams.get(reference.source.model),
            sourceObjects = param.data;

          if (!sourceObjects) {
            return res.respond({
              status: 404,
              error: 'Could not find ' + reference.source.model
                + ' with id ' + param.param.value
            });
          }

          // if we have the source data, then we need to map it to the
          // reference. To do that, we need to get the array of possible values
          // to query the reference data against.
          if (!_.isArray(sourceObjects)) {
            sourceObjects = [sourceObjects];
          }

          var queryArr = [];

          _.each(sourceObjects, function(source) {
            console.log('source', source, 'field', reference.source.field);
            queryArr = _.union(queryArr, source[reference.source.field]);
          });

          var query = {};
          query[reference.referenceBy] = {
            $in: queryArr
          };

          // now we can actually do the query
          // mark our return flag first to avoid multiple responses
          returned = true;

          console.log('checking', reference.model, 'with query', query);

          mongoose.model(reference.model).find(query, function(err, data) {
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
      });
      
      // @TODO joins
      
      // finally, if we haven't returned anything yet, we will default to
      // querying against the returned data type
      if (!returned) {
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
  } else if (method.method === 'POST') {
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
  } else if (method.method === 'PUT') {
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
  } else if (method.method === 'DELETE') {
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
