/**
 * generic/factories/get.js
 *
 * Factory for generic GET handlers.
 */

var mongoose = require('mongoose'),
  _ = require('lodash');

function newHandler(route, Model) {
  // flag to tell us whether we've returned or not
  var returned = false;

  // create function
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
          var referencedValue = source[reference.source.field];

          if (!_.isArray(referencedValue)) {
            referencedValue = [referencedValue];
          }

          queryArr = _.union(queryArr, referencedValue);
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
}

exports = module.exports = {
  newHandler: newHandler
};
