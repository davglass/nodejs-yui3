#!/usr/bin/env node

var sys = require('sys');
var YUI = require("yui3").YUI;
require("assert").equal( global.YUI, undefined, "global yui created");


YUI({
    filter: 'debug',
    debug: true
}).use('node', function(Y) {
    
    Y.log('This output should be colored');

});


YUI({
    filter: 'debug',
    useColor: false,
    debug: true
}).use('node', function(Y) {
    
    Y.log('This output SHOULD NOT be colored');

});
