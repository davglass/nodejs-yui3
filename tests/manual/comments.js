#!/usr/bin/env node

var util = require('util'),
    fs = require('fs');

var YUI = require("yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");


YUI({
    filter: 'debug',
    logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', function(Y) {

    Y.log('JSDom testing..');

    fs.readFile('./comments.html', encoding="utf-8", function(err, data) {

        Y.config.doc.body.innerHTML = data;
        
        Y.log('Document loaded');
        Y.log(Y.config.doc.outerHTML);
        
    });

    




});
