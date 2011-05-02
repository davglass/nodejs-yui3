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
    /*
    "yui3 configure core 320 YUI" : function () {
        var Y = yui3.configure({ core: '3.2.0' }).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.areNotEqual(Y.GlobalConfig.base.indexOf('3.2.0'), -1);
        Assert.isUndefined(Y.Loader);
    },
    */
    "yui3 configure core 330 YUI" : function () {
        var Y = yui3.configure({ core: '3.3.0' }).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.areNotEqual(Y.GlobalConfig.domBase.indexOf('3.3.0'), -1);
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
    "rls full": async(function(data, next) {
        yui3.rls({
            m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 33);
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
            Assert.areEqual(data.js.length, 32);
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
            Assert.areEqual(data.js.length, 14);
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
            Assert.areEqual(data.js.length, 13);
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
            Assert.areEqual(data.js.length, 13);
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
            Assert.areEqual(data.js.length, 13);
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
            Assert.areEqual(data.js.length, 14);
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
            Assert.isTrue(data.js[0].indexOf('yui3-core') > 0);
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
            //TODO This test sucks..
            Assert.isTrue(data.js[0].indexOf('yui3-core') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    /*
    "rls version 32": async(function(data, next) {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.2.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            Assert.isTrue(data.js[0].indexOf('3.2.0') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
            next();
        });
    }),
    */
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
            Assert.areEqual(11, data.js.length, 'Not enough files returned');
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
            Assert.areEqual(13, data.js.length, 'Not enough files returned');
            next();
        });
    })
}));

YUITest.TestRunner.add(suite);
