#!/usr/bin/env node

var util = require('util');
var YUI = require("yui3").YUI;


YUI.add('foo', function(Y) {
    Y.log('FOO LOADED');
});

YUI({
    filter: 'debug',
    debug: true,
    modules: {
        'external-foo': {
            fullpath: __dirname + '/external-module.js'
        }
    }
}).use('base', 'foo', 'external-foo', function(Y) {

    Y.log('This is a test of loading internal and external custom YUI3 modules');

});
