/**
 * urlParams.js
 *
 * Middleware which adds a UrlParams object to the request object. UrlParams
 * is a container for information about the param's name, value, and resolved
 * object.
 */

function UrlParams() {
  this._params = {};
}

UrlParams.prototype.get = function(name) {
  return this._params[name];
}

UrlParams.prototype.has = function(name) {
  return this._params[name]? true : false;
}

UrlParams.prototype.add = function(name, value) {
  this._params[name] = {
    param: {
      name: name,
      value: value
    },
    data: null
  };
}

UrlParams.prototype.resolve = function(name, resolvedValue) {
  this._params[name].data = resolvedValue;
}

exports = module.exports = function(req, res, next) {
  req.urlParams = new UrlParams();

  next();
}
