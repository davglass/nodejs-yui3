#!/usr/bin/env node

var sys = require('sys');
var YUI = require("yui3").YUI;
require("assert").equal( global.YUI, undefined, "global yui created");


YUI.add('foo', function(Y) {
    Y.log('FOO LOADED');
});

YUI({
    loadDir: {
        base: __dirname + '/mods/',
        dirs: ['/', 'views/', '/modals/', '/foo/']
    },
    filter: 'debug',
    debug: true
}).use('base', 'mod1', 'mod2', 'mod3', 'view-mod1', 'view-mod2', 'view-mod3', 'modal-mod1', 'modal-mod2', 'modal-mod3', function(Y) {

    Y.log('This is a test of loading internal and external custom YUI3 modules');

});
