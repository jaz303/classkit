# classkit

How I make classes. Sometimes.

## API

  	var Person = Base.extend(function() {

  		return [

  			// this is the Person constructor
  			function(name) {
  				this.name = name;
  			}
  		
  			'methods', {
  				greet: function() {
  					console.log("I am " + this.name);
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
  					console.log("GET OUT OF MY WAY, " + _super.greet.call(this));
  				}
  			}

  		];

  	});

  	(new Person('Jason')).greet();
  	(new RudePerson('Bob')).greet();
