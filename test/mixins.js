var test = require('tape');
var Class = require('../').Class;

function t(name, fn) {
    test(name, function(test) {
        fn(test);
        test.end();
    });
}

t("mixins", function(assert) {

    var x = 0;

    var M1 = {
        hooks: { hookTest: function() { x += 1; } }
    };

    var M2 = {
        hooks: { hookTest: function() { x += 2; } }
    };

    var M3 = [
        'hooks', { hookTest: function() { x += 3; } },
        'hooks', { hookTest: function() { x += 4; } }
    ];

    var Foo = Class.extend({
        mixins: [M1, M2, M3],
        hooks: { hookTest: function() { x += 5; } }
    });

    var Bar = Foo.extend([
        function() {},
        'mixin', M1,
        'hooks', { hookTest: function() { x += 6; } },
        'mixin', M3
    ]);

    var obj = new Bar();
    obj.hookTest();
    assert.equal(x, 29);

});
