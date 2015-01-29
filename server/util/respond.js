/**
 * respond.js
 *
 * Middleware which adds a .respond() method to response objects so that we can
 * standardize API responses.
 */

function Response(obj) {
  obj = obj || {};

  this.status = typeof obj.status === 'number'? obj.status : 200;
  this.error = obj.error || null; // error can be strings or objects
  this.message = typeof obj.message === 'string'? obj.message : '';
  this.content = typeof obj.content === 'object'? obj.content : null;
}

exports = module.exports = function(req, res, next) {
  res.respond = function(obj) {
    var r = new Response(obj);

    res.status(r.status).jsonp(r);
  };

  next();
}
