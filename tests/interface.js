var assert = require("assert"),
    yui3 = require("../lib/node-yui3");

module.exports = {
    "yui3.useSync" : function () {
        var Y = yui3.useSync("loader");
        assert.ok(Y.Loader);
    },
    "yui3.configure({}).useSync" : function () {
        var Y = yui3.configure({}).useSync("loader");
        assert.ok(Y.Loader);
    },
    "yui3.YUI" : function () {
        var Y = yui3.YUI;
        assert.ok(Y);
        assert.isUndefined(Y.Loader);
    },
    "yui3.configure({}).YUI" : function () {
        var Y = yui3.configure({}).YUI;
        assert.ok(Y);
        assert.isUndefined(Y.Loader);
    },
    "yui3.use" : function () {
        yui3.use("loader", function (Y) {
            assert.ok(Y.Loader);
        });
    },
    "yui3.configure({}).use" : function () {
        yui3.configure({}).use("loader", function (Y) {
            assert.ok(Y.Loader);
        });
    }
};
