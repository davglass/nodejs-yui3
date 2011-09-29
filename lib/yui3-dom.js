/**
* Module loads jsdom & htmlparser support into YUI. Should be autoloaded once DOM is needed.
* @module nodejs-dom
*/
YUI.add('nodejs-dom', function(Y) {
    // detect nodejs
    if (!process.versions.node) return;

    var jsdom = null,
        browser = {}, dom;

    if (!YUI._jsdom) {
        YUI._jsdom = YUI.require('jsdom');
    }

    jsdom = YUI._jsdom;
    dom = jsdom.defaultLevel;
    dom.Element.prototype.blur = function() {};
    dom.Element.prototype.focus = function() {};

    var features = {
        FetchExternalResources: [], 
        ProcessExternalResources : false
    }
    browser.document = jsdom.jsdom('<html><head></head><body></body></html>', null, {features: features});
    browser.window = browser.document.createWindow();

    // Setup an html doctype
    var doctype = new dom.DocumentType(browser.document, 'html');
    browser.document.doctype = doctype;

    browser.document.getElementsByTagName('head').item(0).appendChild(browser.document.createElement('title'));


    browser.document.scrollTop = browser.document.documentElement.scrollTop = browser.document.body.scrollTop = 0;
    browser.document.scrollLeft = browser.document.documentElement.scrollLeft = browser.document.body.scrollLeft = 0;

    browser.window.eval = eval;

    browser.self = browser.window;
    browser.navigator = browser.window.navigator;
    browser.location = browser.window.navigator;
    

    if (Y.config.UA) {
        browser.window.navigator.userAgent = Y.config.UA;
    }

    browser.window.focus = function() {};
    browser.window.blur = function() {};
    browser.window.scrollTo = function() {};

    Y.config.doc = browser.window.document;
    Y.config.win = browser.window;

    if (Y.config.UA) {
        Y.UA = YUI.Env.parseUA();
    }
    
    Y.Browser = browser;

    Y.processCSS();

}, 'NODE', { requires: ['oop'], after: ['oop'] } );

