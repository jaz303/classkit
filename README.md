# classkit

How I make classes. Sometimes.

## API

    var Person = Base.extend(function() {

      return [

        // this is the Person constructor
        function(name) {
          this.name = name;
        },
      
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
            return "GET OUT OF MY WAY, " + _super.greet.call(this);
            console.log();
          }
        }

      ];

    });

    console.log((new Person('Jason')).greet());
    console.log((new RudePerson('Bob')).greet());
