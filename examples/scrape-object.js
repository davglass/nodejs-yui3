#!/usr/bin/env node

var YUI = require("yui3").YUI;

YUI({
    debug: true
}).use('node', 'io', function(Y) {
    
    //Messing with the main page..
    Y.one('title').set('innerHTML', 'Digg News Headlines');
    //Creating the list that we will append the remote data to
    var ul = Y.one('body').appendChild(Y.Node.create('<ul></ul>'));
    
    //Creating a sandboxed instance that we will bind to the remote page that we fetch
    YUI().use('node', function(remotePage) {
        //The page we are fetching
        var url = 'http://digg.com:9500/news';
        
        //This will call io under the hood and get the content of the URL,
        //It will then dump the content of that page into this sandboxed document.
        remotePage.fetch(url, {
            success: function() {
                //Get all the news items from the remote page.
                var newsItems = remotePage.all('#story-items h3');
                //Iterate them
                newsItems.each(function(n) {
                    //Import this "A" node into the outside instances document
                    var a = ul.importNode(n.one('a'), true);
                    //Clean up the relative URL's of hrefs 
                    a.set('href', 'http://digg.com' + a.get('href'));
                    //Append the new node to the list
                    ul.appendChild(Y.Node.create('<li></li>')).append(a);
                });
                //Now, we can print the "outer" instances html and drop it to the screen
                console.log(Y.get('doc').get('outerHTML'));
            },
            failure: function() {
                Y.log('Fetch FAILED', 'error');
            }
        });
    });

});
