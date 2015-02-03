var express = require('express'),
  bodyParser = require('body-parser'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  respond = require('./server/util/respond'),
  urlParams = require('./server/util/urlParams'),
  routeHandlerFactory = require('./server/impl/generic/handlers'),
  urlParamHandlerFactory = require('./server/impl/generic/urlParam');

var db = require('./config/db');
mongoose.connect(db.url);

var app = express();

app.use(bodyParser.json());

// response middleware
app.use(respond);

// middleware for working with URL params
app.use(urlParams);

// models
require('./server/models/user');
require('./server/models/team');
require('./server/models/event');

// read endpoints list
var endpoints = require('./server/endpoints/endpoints');

_.each(endpoints.routes, function(route) {
  var r = app.route(route.url);

  // define url params if there are any
  if (route.urlParams) {
    _.each(route.urlParams, function(param) {
      var impl;

      if (param.implementation) {
        console.log('Using custom implementation for', param.name, route.url);
        impl = require(endpoints.implementationRoot + param.implementation);
      } else {
        console.log('Using generic implementation for', param.name, route.url);
        impl = urlParamHandlerFactory(route, param);
      }

      app.param(param.name, impl);
    });
  }

  _.each(route.methods, function(method) {
    // impl object holds the function which we'll use to respond to requests
    // can be defined explicitly or created
    var impl;

    if (method.implementation) {
      console.log('Using custom implementation for', method.method, route.url);
      impl = require(endpoints.implementationRoot + method.implementation);
    } else {
      console.log('Using generic implementation for', method.method, route.url);
      impl = routeHandlerFactory(route, method);
    }

    switch (method.method) {
      case 'GET':
        r.get(impl);
        break;
      case 'PUT':
        r.put(impl);
        break;
      case 'POST':
        r.post(impl);
        break;
      case 'DELETE':
        r.delete(impl);
        break;
      default:
        throw new Error('Invalid method on '
          + route.url + ': '
          + method.method);
    }

    console.log('Defined:', method.method, route.url);
  });
});

app.listen(8080);
console.log('Magic happens on port 8080');
