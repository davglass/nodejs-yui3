#!/usr/bin/env node

var util = require('util');
var YUI = require("yui3").YUI;

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
