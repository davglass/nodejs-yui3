#!/usr/bin/env node

var util = require('util');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    debug: true
}).use('json', 'base', 'io', 'yql', function(Y) {

    console.log('YQL1: ', Y.YQL);
    var Y2 = YUI({ filter: 'debug', debug: true }).use('*');
    console.log('YQL2: ', Y2.YQL);

});
