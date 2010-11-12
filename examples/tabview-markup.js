#!/usr/bin/env node

var sys = require('sys');

var YUI = require("yui3").YUI;
//require("assert").equal( global.YUI, undefined, "global yui created");

YUI({
    filter: 'debug',
    debug: true
}).use('tabview', function(Y) {

    var document = Y.Browser.document;
    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    div.innerHTML = '<ul><li><a href="#foo">foo</a></li><li><a href="#bar">bar</a></li><li><a href="#baz">baz</a></li></ul><div><div id="foo"><p>foo content</p></div><div id="bar"><p>bar content</p></div><div id="baz"><p>baz content</p></div></div>';
    document.body.appendChild(div);

    console.log(div.outerHTML);
    

    Y.log('Creating the TabView from source..');
    Y.log(Y.one('#demo'));

    var tabview = new Y.TabView({
        srcNode: '#demo'
    });

    Y.log('Rendering..');
    tabview.on('render', function() {
        console.log(Y.one('doc').get('outerHTML'));
        
        Y.log('Render event listener');
    });
    tabview.render();
    
    Y.log('Done..');
    Y.log(div.outerHTML, 'HTML');

});
