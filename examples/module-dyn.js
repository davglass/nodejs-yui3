#!/usr/bin/env node

var sys = require('sys');
var YUI = require("yui3").YUI;
require("assert").equal( global.YUI, undefined, "global yui created");


YUI.add('foo', function(Y) {
    Y.log('FOO LOADED');
}, '1.0', { requires: ['external-foo'] });

YUI({
    filter: 'debug',
    debug: true,
    modules: {
        'external-foo': {
            fullpath: __dirname + '/external-module.js'
        }
    }
}).use('base', 'foo', function(Y) {

    Y.log('This is a test of loading internal and external custom YUI3 modules');

});
