var test = require('tape');
var Class = require('../').Class;

function t(name, fn) {
    test(name, function(test) {
        fn(test);
        test.end();
    });
}

t("constructor", function(assert) {

    var A = Class.extend(function() {
        return [
            function(foo) {
                this.foo = foo;
            }
        ];
    });

    var a = new A('bar');

    assert.equal(a.foo, 'bar');

});

t("superconstructor", function(assert) {

    var A = Class.extend(function() {
        return [
            function(foo) {
                this.foo = foo;
            }
        ];
    });

    var B = A.extend(function(_sc, _sm) {
        return [
            function(foo) {
                _sc.call(this, foo);
            }
        ]
    });

    var b = new B('moose')

    assert.equal(b.foo, 'moose');

});

t("methods", function(assert) {

    var A = Class.extend(function() {
        return [
            function(name) { this.name = name; },
            'methods', {
                getName: function() { return this.name; },
                greet: function() { return "hello " + this.getName() }
            }
        ];
    });

    var B = A.extend(function(_sc, _sm) {
        return [
            function(name) { _sc.call(this, name); },
            'methods', {
                getName: function() { return this.name.toUpperCase(); },
                greet: function() {
                    return _sm.greet.call(this).replace('hello', 'AWRITE');
                }
            }
        ];
    });

    var b = new B('Jason');

    assert.equal(b.getName(), 'JASON');
    assert.equal(b.greet(), 'AWRITE JASON');

});

t("properties", function(assert) {

    var A = Class.extend(function() {
        return [
            function(val) { this._v = val; },
            'properties', {
                value: {
                    get: function() { return this._v; },
                    set: function(v) { this._v = v * 10; }
                }
            }
        ];
    });

    var a = new A(50);

    assert.equal(a.value, 50);

    a.value = 100;
    assert.equal(a.value, 1000);

});

t("method()", function(assert) {

    var A = Class.extend(function() {
        return [
            function(name) { this.name = name; },
            'methods', {
                getName: function() { return this.name; }
            }
        ];
    });

    var a = new A('Jason');
    var m = a.method('getName');

    a.getName = function() { return "forgot my name"; }

    assert.equal(m(), 'Jason');

});

t("lateBoundMethod()", function(assert) {

    var A = Class.extend(function() {
        return [
            function(name) { this.name = name; },
            'methods', {
                getName: function() { return this.name; }
            }
        ];
    });

    var a = new A('Jason');
    var m = a.lateBoundMethod('getName');

    a.getName = function() { return "forgot my name"; }

    assert.equal(m(), 'forgot my name');

});