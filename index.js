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

Class.extend = function(feats) {
  if (!feats) {
    feats = [function() {}];
  } else {
    if (typeof feats === 'function') {
      feats = (feats.length > 1) ? feats(this, this.prototype) : feats(this.prototype);
    }
    feats = flatten(feats, true);
  }

  var ctor = feats[0];

  ctor._super = this;
  ctor.prototype = Object.create(this.prototype);
  ctor.prototype.constructor = ctor;
  
  ctor.extend = this.extend;
  ctor.Features = Object.create(this.Features);

  function flatten(thing, ctor) {
    if (Array.isArray(thing)) return thing;
    var list = ctor ? [thing.construct || function() {}] : [];
    for (var k in thing) {
      if (k !== 'construct') list.push(k, thing[k]);
    }
    return list;
  }

  (function _applyFeatures(list, start) {
    for (var i = start; i < list.length; i += 2) {
      if (list[i] === 'mixin') {
        _applyFeatures(flatten(list[i+1], false), 0);
      } else if(list[i] === 'mixins') {
        list[i+1].forEach(function(m) { _applyFeatures(flatten(m, false), 0); });
      } else {
        ctor.Features[list[i]].apply(ctor, list[i+1], this);
      }
    }  
  })(feats, 1);

  for (var k in this.Features) {
    var finalize = this.Features[k].finalize;
    if (finalize) {
      finalize(ctor, this);  
    }
  }
  
  return ctor;
};

Class.Features = {
  methods: {
    apply: function(ctor, methods, superClass) {
      for (var methodName in methods) {
        ctor.prototype[methodName] = methods[methodName];
      }  
    }
  },
  properties: {
    apply: function(ctor, properties, superClass) {
      Object.defineProperties(ctor.prototype, properties);
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
    }
  }
};

function makeDelegate(member, method) {
  return function() {
    var target = this[member];
    return target[method].apply(target, arguments);
  }
}

var HOOK_KEY = (typeof Symbol === 'undefined')
                ? 'classkit__hooks'
                : new Symbol('hooks');

Class.Features.hooks = {
  apply: function(ctor, hooks, superClass) {
    var allHooks = ctor[HOOK_KEY] || (ctor[HOOK_KEY] = {});
    for (var k in hooks) {
      var theseHooks = allHooks[k] || (allHooks[k] = []);
      theseHooks.push(hooks[k]);
    }
  },
  finalize: function(ctor, superClass) {
    var allHooks = ctor[HOOK_KEY];
    if (!allHooks) return;
    for (var k in allHooks) {
      (function(name, list, sup) {
        var len = list.length;
        ctor.prototype[name] = function() {
          if (sup) sup.apply(this, arguments);
          for (var i = 0; i < len; ++i) {
            list[i].apply(this, arguments);
          }
        }
      })(k, allHooks[k], superClass.prototype[k]);
    }
  }
}