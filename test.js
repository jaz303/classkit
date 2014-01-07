var Class = require('./index').Class;

var PropertyObject = Class.extend();

function makeProperty(proto, name, value) {
  var suffix = name.charAt(0).toUpperCase() + name.substring(1);

  proto['get' + suffix] = function() { return this[name] || value; };
  proto['set' + suffix] = function(v) { this[name] = v; };
}

// a feature receives the new class' constructor function and
// a parameters object which contains configuration data for
// the feature
PropertyObject.Features.properties = function(ctor, props) {
  for (var k in props) {
    makeProperty(ctor.prototype, k, props[k]);
  }
}

var Person = PropertyObject.extend(function() {
  return [
    function() {},

    // dictionary of properties for Person class
    'properties', {
      name: 'A Nameless One',
      age: '100'
    }
  ];
});

var person = new Person;
console.log(person.getName()); // => "A Nameless One"

person.setName("Jason");
console.log(person.getName()); // => "Jason"