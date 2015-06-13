exports.Class = Class;

function Class() {};
  
Class.prototype.method = function(name) {
  var self = this, method = this[name];
  return function() { return method.apply(self, arguments); }
}

Class.prototype.lateBoundMethod = function(name) {
  var self = this;
  return function() { return self[name].apply(self, arguments); }
}

Class.extend = function(fn) {

  var features;

  if (fn) {
    // backwards compatibility
    if (fn.length > 1) {
      features = fn(this, this.prototype);
    } else {
      features = fn(this.prototype);
    }
  } else {
    features = [function() {}];
  }
  
  var ctor = features[0];
  ctor._super = this;
  ctor.prototype = Object.create(this.prototype);
  ctor.prototype.constructor = ctor;
  
  ctor.extend = this.extend;
  ctor.Features = Object.create(this.Features);
    
  for (var i = 1; i < features.length; i += 2) {
    this.Features[features[i]].apply(ctor, features[i+1], this);
  }

  for (var k in this.Features) {
    this.Features[k].finalize(ctor, this);
  }
  
  return ctor;
  
};

Class.Features = {
  methods: {
    apply: function(ctor, methods, superClass) {
      for (var methodName in methods) {
        ctor.prototype[methodName] = methods[methodName];
      }  
    },
    finalize: function(ctor, superClass) {
    }
  },
  properties: {
    apply: function(ctor, properties, superClass) {
      Object.defineProperties(ctor.prototype, properties);
    },
    finalize: function(ctor, superClass) {
    }
  },
  delegate: {
    apply: function(ctor, delegates, superClass) {
      for (var methodName in delegates) {
        var target = delegates[methodName];
        if (Array.isArray(target)) {
          ctor.prototype[methodName] = makeDelegate(target[0], target[1]);
        } else {
          ctor.prototype[methodName] = makeDelegate(target, methodName);
        }
      }
    },
    finalize: function(ctor, superClass) {
    }
  }
};

function makeDelegate(member, method) {
  return function() {
    var target = this[member];
    return target[method].apply(target, arguments);
  }
}