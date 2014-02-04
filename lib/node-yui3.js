var getYUI = function(c) {
    var yui3 = require('./yui3-yui3');
    var YUI = yui3.configure(c);
    if (c) {
        cleanCache();
    }
    return YUI;
}

var cleanCache = function() {
    for (var i in require.main.moduleCache) {
        var id = require.main.moduleCache[i].id+'';
        if (id && id.match(/yui3/)) {
            delete require.main.moduleCache[i];
        }
    }
}

// YInterface allows these two to work:
// var Y = yui3.useSync("io");
// var Y = yui3.configure({core:"3.3.0"}).useSync("io");
// See also: tests/interface.js

function YInterface (config) {
    this.config = config || {};
}

var interface = YInterface.prototype;

interface.__defineGetter__('YUI', function() {
    var YUI = getYUI(this.config);
    return YUI;
});


interface.sync = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = true;
    return YUI();
};
interface.async = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = false;
    return YUI();
};

interface.useSync = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = true;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.use = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = false;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.configure = function (config) {
    return new YInterface(config);
};

module.exports = new YInterface;

/*
process.on('uncaughtException', function (err) {
    if (err.stack) {
        console.log(err.stack);
    } else {
        console.log('Exception: ', err);
    }
});
*/
