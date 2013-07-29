# classkit

How I make classes. Sometimes.

Call `Base.extend`, passing a callback function that returns a class descriptor, an array whose first element is the class constructor and whose successive values are interpreted as pairs of feature names/parameters.

## Simple Usage

    var Person = Base.extend(function() {

      return [

        // this is the Person constructor
        function(name) {
          this.name = name;
        },
      
        // instance methods feature + method dictionary
        'methods', {
          greet: function() {
            return "I am " + this.name;
          }
        }
      
      ];

    });

    // when extending classes, super constructor and prototype are passed
    // to callback function for capture by closure.
    var RudePerson = Person.extend(function(_superc, _super) {

      return [

        function(name) {
          _superc.apply(this, arguments);
        },

        'methods', {
          greet: function() {
            return "GET OUT OF MY WAY, " + _super.greet.call(this).toUpperCase();
          }
        }

      ];

    });

    console.log((new Person('Jason')).greet());
    console.log((new RudePerson('Bob')).greet());

## Adding Features

Subclasses can define new `Features`. A `Feature` is simply a function that receives the class constructor and some configuration data as parameters and then effects change on the new class' prototype. Here's an example that auto-generates getters and setters:

    var PropertyObject = Base.extend();

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
