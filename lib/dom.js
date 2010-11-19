/**
* Module loads jsdom & htmlparser support into YUI. Should be autoloaded once DOM is needed.
* @module nodejs-dom
*/
YUI.add('nodejs-dom', function(Y) {
    var jsdom = null,
        parser = null,
        browser, dom;
    
    if (!YUI._jsdom) {
        YUI._jsdom = YUI.require('jsdom');
    }

    //Cache the htmlparser require.
    if (!YUI._htmlparser) {
        YUI._htmlparser = YUI.require('htmlparser');
    }
    jsdom = YUI._jsdom;
    parser = YUI._htmlparser;
    
    dom = jsdom.defaultLevel;
    if (!dom.Element.prototype.blur) {
        dom.Element.prototype.blur = function() {};
        dom.Element.prototype.focus = function() {};
    }


    browser = jsdom.windowAugmentation(dom, {
        parser: parser
    });

    browser.window.eval = eval;

    if (Y.config.UA) {
        browser.window.navigator.userAgent = Y.config.UA;
    }

    Y.config.doc = browser.window.document;
    Y.config.win = browser.window;

    if (Y.config.UA) {
        Y.UA = YUI.Env.parseUA();
    }
    
    Y.Browser = browser;

    Y.processCSS();

}, 'NODE', { requires: ['oop'], after: ['oop'] } );

