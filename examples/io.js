#!/usr/bin/env node

var sys = require('sys');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    debug: true
}).use('json', 'io', function(Y) {

    var url = 'http:/'+'/yuilibrary.com/gallery/api/user/davglass';
    
    var url2 = 'http:/'+'/localhost/~davglass/node-post/';

    var url3 = 'http:/'+'/localhost:8500/';

    var url4 = 'https:/'+'/graph.facebook.com:443/davglass';

    Y.io(url, {
        on: {
            start: function() {
                Y.log('Start IO #1', 'info', 'io1');
            },
            success: function(id, o) {
                //Y.log(o.responseText);
                Y.log(sys.inspect(Y.JSON.parse(o.responseText).userinfo), 'info', 'io1');
            }
        }
    });


    Y.io(url2, {
        method: 'POST',
        headers: {
            foo: 'bar'
        },
        //data: 'test=post&this=data&testing=three',
        
        data: {
            test: 'post',
            'this': 'data',
            'testing': 'three'
        },
        on: {
            start: function() {
                Y.log('Start IO #2', 'info', 'io2');
            },
            success: function(id, o) {
                Y.log(sys.inspect(Y.JSON.parse(o.responseText)), 'info', 'io2');
            },
            failure: function(id, o) {
                Y.log('IO #2 FAILED', 'error', 'io2');
            }
        }
    });
    
    Y.io(url3, {
        on: {
            start: function() {
                Y.log('Start IO #3', 'info', 'io3');
            },
            failure: function(id, o) {
                Y.log('IO FAILED', 'error', 'io3');
            }
        }
    });

    Y.io(url4, {
        on: {
            start: function() {
                Y.log('Start IO #4', 'info', 'io4');
            },
            success: function(id, o) {
                Y.log(sys.inspect(Y.JSON.parse(o.responseText)), 'info', 'io4');
            }
        }
    });

});
