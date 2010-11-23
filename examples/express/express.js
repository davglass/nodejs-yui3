#!/usr/bin/env node

var express = require('express'),
    YUI = require('yui3').YUI;


YUI({ debug: false, filter: 'debug' }).use('express', 'node', function(Y) {

    var app = express.createServer();

    app.configure(function(){
        app.use(express.methodOverride());
        app.use(express.bodyDecoder());
        app.use(app.router);
        app.use(express.staticProvider(__dirname + '/assets'));
    });

    app.register('.html', YUI);

    app.get('/combo', YUI.combo);

    app.get('/tabview', function(req, res) {
        YUI().use('node', function(Y) {
            Y.Env._loader.ignoreRegistered = true;
            Y.use('tabview', function(Y) {
                var div = Y.Node.create('<div id="demo"></div>');
                Y.one('title').set('innerHTML', 'YUI3 tabView Page');
                Y.one('body').addClass('yui3-skin-sam').appendChild(div);
                
                Y.log('Creating the TabView from script..');
                var tabview = new Y.TabView({
                    children: [{
                        label: 'foo',
                        content: '<p>foo content</p>'
                    }, {
                        label: 'bar',
                        content: '<p>bar content</p>'
                    }, {
                        label: 'baz',
                        content: '<p>baz content</p>'
                    }]
                });
                tabview.render('#demo');

                res.render('tabview.html', {
                    locals: {
                        instance: Y,
                        use: ['tabview'],
                        //filter: 'debug',
                        content: '#content',
                        after: function(Y) {
                            Y.Get.domScript('/tabview.js');
                        }
                    }
                });
            });
        });
    });

    YUI.partials = [
        {
            method: 'append',
            node: 'body',
            name: 'layout_append'
        },
        {
            method: 'prepend',
            node: 'body',
            name: 'layout_prepend'
        }
    ];

    app.get('/', function(req, res){
        res.render('index.html', {
            locals: {
                content: '#content',
                sub: {
                    title1: 'Title #1',
                    title2: 'Title #2',
                    title3: 'Title #3',
                    title4: 'Title #4'
                },
                partials: [
                    {
                        method: 'append',
                        node: 'head',
                        name: 'layout_head'
                    }
                ],
                after: function(Y, options, partial) {
                    Y.Get.domScript('/main.js');
                    Y.one('title').set('innerHTML', 'This is a test');

                    var str = partial('test');
                    var html = '';
                    var data = ['one', 'two', 'three'];
                    data.forEach(function(v) {
                        html += Y.Lang.sub(str, { name: v })
                    });
                    Y.one('#content').prepend('<ul>' + html + '</ul>');
                },
                before: function(Y) {
                    Y.one('h1').set('innerHTML', 'BooYah!!');
                }
            }
        });
    });
    
    app.get('/pre', YUI.express({render: 'index.html', locals: {}}), function(req, res){
        res.sub({
            above_content: 'This was inserted above the content.',
            title: 'Title #1',
            title2: 'Title #2',
            title3: 'Title #3',
            title4: 'Title #4'
        });
        res.send();
    });

    app.listen(3000);

});
    
