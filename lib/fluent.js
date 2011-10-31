var Class = require("class-42");
var EventEmitter = require("events").EventEmitter;
var Promise = require("./promise.js");

var Fluent = {
  initialize: function(object) {
    object._fluent_promise = new Promise(null);
  },
  
  wrap: function(f) {
    return function() {
      var g = f.bind.bind(f, this).apply(f, arguments);

      var output = new Promise();
      this._fluent_promise.callback(function() {
        try {
          g();
        } catch (err) {
          output.fail(err);
          return;
        }
  
        output.succeed();
      });

      this._fluent_promise = output;
      return this;
    };
  },
  
  async: function(f) {
    return function() {
      var g = f.bind.bind(f, this).apply(f, arguments);
      
      var output = new Promise();
      this._fluent_promise.callback(function() {
        g(function(err) {
          (err) ? output.fail(err) : output.succeed();
        });
      });

      this._fluent_promise = output;
      return this;
    };
  },
}

module.exports = Fluent;
