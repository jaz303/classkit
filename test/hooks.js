var test = require('tape');
var Class = require('../').Class;

function t(name, fn) {
    test(name, function(test) {
        fn(test);
        test.end();
    });
}

t("hooks, basic", function(assert) {

    var b = 0;
    var a = 0;

    var Foo = Class.extend(function() {
        return [
            function() {},
            'hooks', {
                beforeFoo: function(x) { b += x; },
                afterFoo: function(x, y) { a += (x + y); }
            },
            'hooks', {
                beforeFoo: function(x) { b += (2 * x); },
                afterFoo: function(x, y) { a += (x * y); }
            }
        ]
    });

    var foo = new Foo();

    foo.beforeFoo(10);
    assert.equal(b, 30);

    foo.afterFoo(5, 10);
    assert.equal(a, 65);


});

t("hooks, extension", function(assert) {

    var str = '';

    var A = Class.extend(function() {
        return [
            function() {},
            'hooks', {
                test: function(x) { str += 'a' + ('' + x); }
            }
        ];
    });

    var B = A.extend(function() {
        return [
            function() {},
            'hooks', {
                test: function(x) { str += 'b' + ('' + x); }
            }
        ];
    });

    var C = B.extend(function() {
        return [
            function() {},
            'hooks', {
                test: function(x) { str += 'c' + ('' + x); }
            }
        ];
    });

    var foo = new C();

    foo.test(5);

    assert.equal(str, 'a5b5c5');

});