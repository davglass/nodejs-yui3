#!/usr/bin/env node

var util = require('util'),
    yui3 = require("yui3");

var YUI = yui3.YUI;

var YUI3 = yui3.configure({
    core: '@2010.12.06',
    gallery: '2010.09.22'
});


YUI3({
    debug: true
}).use('node', 'gallery-yql', function(Y) {

    new Y.yql('select * from github.user.info where (id = "davglass")', function(r) {
        //Do something here.
        Y.log(r.query, 'debug', 'yql');
    });
    

    console.log('Gallery: ');
    console.log(Y.config.groups.gallery);
});

YUI({
    debug: true
}).use('node', 'gallery-yql', function(Y) {

    new Y.yql('select * from github.user.info where (id = "davglass")', function(r) {
        //Do something here.
        Y.log(r.query, 'debug', 'yql');
    });
    

    console.log('Gallery: ');
    console.log(Y.config.groups.gallery);
});
