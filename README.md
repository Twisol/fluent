# Fluent

Fluent allows you to create simple interfaces for pipelining asynchronous
actions.

    var Fluent = require("fluent");
    var Class = require("class-42");
    
    var MyFluent = Class.extend({
      initialize: function() {
        Fluent.initialize(this);
      },
      
      doFoo: Fluent.async(function(a, b, c, callback) {
        process.nextTick(function() {
          console.log(a, b, c);
          callback();
        });
      }),
      
      doBar: Fluent.wrap(function(a, b) {
        console.log(a + b);
      })
    });
    
    var o = new MyFluent();
    o.doFoo(1, 2, 3).doBar(4, 5);
    // prints:
    //   1  2  3
    //   9

Fluent provides two decorators, `async` and `wrap`, which queue the wrapped
method when called. `Fluent.async` provides a callback to determine when the
operation is complete, whereas `Fluent.wrap` assumes it's finished after
the return.
