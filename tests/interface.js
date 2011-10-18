var yui3 = require("yui3");
var YUITest = require("yuitest").YUITest;

var Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    suite = new YUITest.TestSuite("YUI");

//Generic Async Wait
var async = function(fn) {
    var count = 0;
    return function(data) {
        var loaded = false;
        var w = function() {
            if (count === 1000) {
                throw new Error('Async Timer reached 1000 iterations..');
            }
            count++;
            if (!loaded) {
                this.wait(w, 10);
            }
        };
        var next = function() {
            loaded = true;
        };
        fn.call(this, data, next);
        this.wait(w, 10);
    };
};

suite.add( new YUITest.TestCase({
    name: 'Interface',
    "yui3 useSync" : function () {
        var Y = yui3.silent().useSync("loader");
        Assert.isObject(Y.Loader);
    },
    "yui3 configure useSync" : function () {
        var Y = yui3.configure({ debug: false }).useSync("loader");
        Assert.isObject(Y.Loader);
    },
    "yui3 YUI" : function () {
        var Y = yui3.YUI;
        Assert.isObject(Y);
        Assert.isUndefined(Y.Loader);
    },
    "yui3 configure YUI" : function () {
        var Y = yui3.configure({}).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.isUndefined(Y.Loader);
    },

    "yui3 configure core 330 YUI" : function () {
        var Y = yui3.configure({ core: '3.3.0' }).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.areNotEqual(Y.GlobalConfig.domBase.indexOf('3.4.0'), -1);
        Assert.isUndefined(Y.Loader);
    },
    "yui3 use" : async(function (data, next) {
        yui3.silent().use("loader", function (Y) {
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "yui3 configure use" : async(function (data, next) {
        yui3.configure({ debug: false }).use("loader", function (Y) {
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "yui3 no gallery" : async(function (data, next) {
        yui3.configure({ debug: false, gallery: false }).use("loader", function (Y) {
            Assert.isUndefined(Y.config.groups.gallery);
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "yui3 no 2in3" : async(function (data, next) {
        yui3.configure({ debug: false, '2in3': false }).use("loader", function (Y) {
            Assert.isUndefined(Y.config.groups.yui2);
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "yui3 no 2in3 and no gallery" : async(function (data, next) {
        yui3.configure({ debug: false, '2in3': false, gallery: false }).use("loader", function (Y) {
            Assert.isUndefined(Y.config.groups.gallery);
            Assert.isUndefined(Y.config.groups.yui2);
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "yui3 no 2in3 and no gallery" : async(function (data, next) {
        var core = require('./node_modules/yui3/node_modules/yui3-core');
        yui3.configure({ debug: false, '2in3': false, gallery: false, yuiPath: core.path(), yuiCoreFile: 'build/yui/yui-debug.js' }).use("loader", function (Y) {
            Assert.isUndefined(Y.config.groups.gallery);
            Assert.isUndefined(Y.config.groups.yui2);
            Assert.isObject(Y.Loader);
            next();
        });
    }),
    "imageloader test" : async(function (data, next) {
        var core = require('./node_modules/yui3/node_modules/yui3-core');
        yui3.configure({ debug: false, '2in3': false, gallery: false, yuiPath: core.path(), yuiCoreFile: 'build/yui/yui-debug.js' }).use("imageloader", function (Y) {
            Assert.isUndefined(Y.config.groups.gallery);
            Assert.isUndefined(Y.config.groups.yui2);
            Assert.isObject(Y.Loader);
            Assert.isObject(Y.ImgLoadGroup);
            next();
        });
    }),
    "io test" : async(function (data, next) {
        yui3.silent().use("loader", 'io', function (Y) {
            Y.io('http://login.yahoo.com/', {
                on: {
                    success: function(id, e) {
                        Assert.isObject(Y.Loader);
                        Assert.isFunction(Y.io);
                        //It made it here, no socket hang up
                        next();
                    }
                }
            });
        });
    }),
    "uploader test" : async(function (data, next) {
        var core = require('./node_modules/yui3/node_modules/yui3-core');
        yui3.configure({ debug: false, '2in3': false, gallery: false, yuiPath: core.path(), yuiCoreFile: 'build/yui/yui-debug.js' }).use("uploader", function (Y) {
            Assert.isUndefined(Y.config.groups.gallery);
            Assert.isUndefined(Y.config.groups.yui2);
            Assert.isObject(Y.Loader);
            Assert.isObject(Y.Uploader);
            next();
        });
    })
}));

suite.add( new YUITest.TestCase({
    name: 'RLS',
    "rls css none in env": async(function(data, next) {
        yui3.rls({
            m: 'loader-base,autocomplete',
            env: 'attribute,attribute-base,attribute-complex,base,base-base,base-build,base-pluginhost,classnamemanager,console,dd,dd-constrain,dd-ddm,dd-ddm-base,dd-ddm-drop,dd-delegate,dd-drag,dd-drop,dd-drop-plugin,dd-proxy,dd-scroll,dom-base,dom-screen,dom-style,dom-style-ie,event-base,event-custom,event-custom-base,event-custom-complex,event-delegate,event-focus,event-mouseenter,event-resize,event-synthetic,features,get,intl,intl-base,io-base,jsonp,jsonp-url,lang/console,node,node-base,node-event-delegate,node-pluginhost,node-screen,node-style,oop,pluginhost,pluginhost-base,pluginhost-config,querystring-stringify-simple,rls,selector-css2,selector-native,substitute,widget,widget-base,widget-htmlparser,widget-uievents,yql,yui,yui-base,yui-later,yui-log,yui-throttle',
            v: '3.3.0'
        }, function(err, data) {
            Assert.areEqual(data.css.length, 3);
            next();
        });
    }),
    "rls css in env": async(function(data, next) {
        yui3.rls({
            m: 'loader-base,autocomplete',
            env: 'attribute,attribute-base,attribute-complex,base,base-base,base-build,base-pluginhost,classnamemanager,console,dd,dd-constrain,dd-ddm,dd-ddm-base,dd-ddm-drop,dd-delegate,dd-drag,dd-drop,dd-drop-plugin,dd-proxy,dd-scroll,dom-base,dom-screen,dom-style,dom-style-ie,event-base,event-custom,event-custom-base,event-custom-complex,event-delegate,event-focus,event-mouseenter,event-resize,event-synthetic,features,get,intl,intl-base,io-base,jsonp,jsonp-url,lang/console,node,node-base,node-event-delegate,node-pluginhost,node-screen,node-style,oop,pluginhost,pluginhost-base,pluginhost-config,querystring-stringify-simple,rls,selector-css2,selector-native,skin-sam-console,skin-sam-widget,substitute,widget,widget-base,widget-htmlparser,widget-skin,widget-uievents,yql,yui,yui-base,yui-later,yui-log,yui-throttle',
            v: '3.3.0'
        }, function(err, data) {
            //Should only contain the Autocomplete CSS
            Assert.areEqual(data.css.length, 2);
            next();
        });
    }),
    /*
    "rls full": async(function(data, next) {
        yui3.rls({
            m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 42);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    //No ENV, should return YUI module
    "rls mods no env": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            Assert.areEqual(data.js.length, 41);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual((data.js.length +  data.css.length), Object.keys(data.d).length);
            next();
        });
    }),
    "rls yui loader": async(function(data, next) {
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 22);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls yui one module and noloader": async(function(data, next) {
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 21);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls yui only": async(function(data, next) {
        yui3.rls({
            m: 'yui',
            v: '3.3.0'
        }, function(err, data) {
            Assert.areEqual(1, data.js.length);
            Assert.areEqual(0, data.css.length);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls loader only": async(function(data, next) {
        yui3.rls({
            m: 'loader',
            v: '3.3.0',
            env: 'attribute,attribute-base,attribute-complex,bar2,base,base-base,base-build,base-pluginhost,baz,classnamemanager,console,dd,dd-constrain,dd-ddm,dd-ddm-base,dd-ddm-drop,dd-delegate,dd-drag,dd-drop,dd-drop-plugin,dd-proxy,dd-scroll,dom-base,dom-screen,dom-style,dom-style-ie,event-base,event-custom,event-custom-base,event-custom-complex,event-delegate,event-focus,event-mouseenter,event-resize,event-synthetic,features,foo,get,intl,intl-base,io-base,jsonp,jsonp-url,lang/console,node,node-base,node-event-delegate,node-pluginhost,node-screen,node-style,oop,pluginhost,pluginhost-base,pluginhost-config,querystring-stringify-simple,rls,selector-css2,selector-native,substitute,widget,widget-base,widget-htmlparser,widget-skin,widget-uievents,yql,yui,yui-base,yui-later,yui-log,yui-throttle'
        }, function(err, data) {
            Assert.areEqual(1, data.js.length);
            next();
        });
    }),
    "rls invalid module": async(function(data, next) {
        yui3.rls({
            m: ['bogus-yui-module']
        }, function(err, data) {
            Assert.areEqual(0, data.js.length);
            Assert.areEqual(0, data.css.length);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    
    "rls yui customloader no serve loader": async(function(data, next) {
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            Assert.areEqual(data.js.length, 21);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls yui customloader debug": async(function(data, next) {
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-debug.js'
            }
        }, function(err, data) {
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-debug.js');
            Assert.areEqual(data.js.length, 21);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    //Custom loader should only be used on the server, it should not be served.
    "rls yui customloader serve loader": async(function(data, next) {
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            Assert.areNotEqual(data.Y.config.loaderPath, data.js[1]);
            Assert.areEqual(data.Y.config._loaderPath, data.js[1]);
            Assert.areEqual(data.js.length, 22);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls env": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls filter raw": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'RAW'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls filter min": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'MIN'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager-min.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls filter debug": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'DEBUG'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager-debug.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "RLS Object": async(function(data, next) {
        var config = {
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22'
        }
        var c = {
            core: config.v,
            gallery: config.gv,
            yui2: false
        };
        var YUI = yui3.configure(c).YUI;
        
        new yui3.RLS(YUI, config).compile(function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            //TODO This test sucks..
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
        
    }),
    "rls version 33": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls version gallery": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.3.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-gallery') > -1) {
                    //Assert.isTrue(v.indexOf('2010.09.22') > 0);
                }
            });
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls version yui2": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.3.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-2in3') > -1) {
                    Assert.isTrue(v.indexOf('2.8.0') > 0);
                }
            });
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    "rls imageloader": async(function(data, next) {
        yui3.rls({
            m: 'imageloader',
            env: 'yui',
            v: '3.3.0'
        }, function(err, data) {
            Assert.isArray(data.js);
            Assert.areEqual(15, data.js.length, 'Not enough files returned');
            next();
        });
    }),
    "rls uploader": async(function(data, next) {
        yui3.rls({
            m: 'uploader',
            env: 'yui',
            v: '3.3.0'
        }, function(err, data) {
            Assert.isArray(data.js);
            Assert.areEqual(17, data.js.length, 'Not enough files returned');
            next();
        });
    })
    */
}));

YUITest.TestRunner.add(suite);
