var Class = require("class-42");
var EventEmitter = require("events").EventEmitter;

var Promise = Class.extend(EventEmitter, {
  initialize: function(value) {
    // 0 waiting, 1 success, 2 error
    this._state = 0;
    if (value !== undefined) {
      this.succeed(value);
    }
  },

  callback: function(f) {
    if (this._state === 0)
      this.once("success", f);
    else if (this._state === 1)
      f(this._value);
    
    return this;
  },

  errback: function(f) {
    if (this._state === 0)
      this.once("error", f);
    else if (this._state === 2)
      f(this._value);

    return this;
  },

  succeed: function(value) {
    if (this._state !== 0) return;
    
    this._value = value;
    this._state = 1;
    this.emit("success", value);
  },

  fail: function(value) {
    if (this._state !== 0) return;
    
    this._value = value;
    this._state = 2;
    this.emit("error", value);
  },


  chain: function(f) {
    var output = new Promise();

    this.callback(function(value) {
      f(value).
        callback(output.succeed.bind(output));
    }).errback(output.fail.bind(output));

    return output;
  }
});

Promise.lift = function(f) {
  return function(value) {
    var promise = new Promise();
    
    f(value, function(err, value) {
      (err) ? promise.fail(err) : promise.succeed(value);
    });

    return promise;
  };
};

module.exports = Promise;
