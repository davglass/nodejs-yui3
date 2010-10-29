/**
* ExpressJS view engine for YUI3
* @module express
*/
YUI.add('express', function(Y) {

    var path = YUI.require('path'),
        fs = YUI.require('fs'),
        sys = YUI.require('sys'),
        DEBUG = false;

    /**
    * Hash of all YUI instances uses in the course of rendering the pages.
    * So they can be blown away after they are used.
    * @static
    * @property _express
    * @private
    */
    YUI._express = {};

    /**
    * Cleans and destroys all used YUI instances from inside of Express
    * @static
    * @method cleanExpress
    */
    YUI.cleanExpress = function() {
        var count = 0;
        for (var i in YUI._express) {
            count++;
            var inst = YUI._express[i];
            delete inst.config.doc;
            delete inst.config.win;
            delete YUI._express[i];
            if (inst.destroy) {
                inst.destroy();
            }
            delete inst;
        }
    };

    /**
    * List of docTypes that can be used in the views
    * @static
    * @property docTypes
    */
    YUI.docTypes = {
        '5': '<!DOCTYPE html>', //DEFAULT
        '4-strict': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
        '4-trans': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
        'x-strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        'x-trans': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
    };

    /**
    * The default docType to use when rendering content, defaults to HTML5: <!DOCTYPE html>
    * @static
    * @property defaultDocType
    */
    YUI.defaultDocType = '5',

    /**
    * These partials will be added to every page served by YUI, good for templating.
    * They can be added to by locals.partials on a per page basis. A partial looks like this:
    * {
    *   name: 'header', //Name of the /views/partial/{name}.html file to load
    *   method: 'append', //append,prepend,appendChild
    *   node: '#conent', //Any valid selector
    *   enum: 'one', //one,all
    *   fn: function //The callback function to run after the action.
    * }
    * @property partials
    * @static
    */
    YUI.partials = [];

    /**
    * Configures YUI url routers
    * @method configure
    * @param {Express} app Reference returned from express.createServer();
    * @param {Object} config Configuration object for static file handlers: { yui2: '/2in3/', yui3: '/yui3/' }
    * @static
    */
    YUI.configure = function(app, config) {
        for (var i in config) {
            YUI.domRoot[i] = config[i];
            app.get(config[i] + '*', YUI.handler);
        }

        app.configure('development', function(){
            DEBUG = true;
        });

        app.configure('production', function(){
            DEBUG = false;
        });

    };

    /**
    * Handler given in YUI.configure to handle static YUI resources
    * @method handler
    * @param {ExpressRequest} req Request object passed from app.get();
    * @param {ExpressResponse} res Response object passed from app.get();
    * @static
    */
    YUI.handler = function(req, res) {
        var root = req.url.split('/')[1],
            group;
        for (var i in YUI.domRoot) {
            if (YUI.domRoot[i] == '/' + root + '/') {
                group = i;
            }
        }

        var file = req.params[0],
            base = ((Y.config.groups[group]) ? Y.config.groups[group].base : Y.config.base),
            domBase = ((Y.config.groups[group]) ? Y.config.groups[group].domBase : Y.config.domBase),
            filePath = path.join(base, file),
            regEx = new RegExp(domBase.replace('2in3.3/', ''), 'gi');

        if (filePath.indexOf('.css') > -1) { //We need to "rewrite" the CSS paths here
            fs.readFile(filePath, encoding='utf8', function(err, data) {
                if (data) {
                    data = data.replace(regEx, '/' + group + '/');
                } else {
                    data = '';
                }
                res.contentType(filePath);
                res.send(data);
            });
        } else {
            res.sendfile(filePath);
        }
    };

    /**
    * Default handler for expressjs view rendering. app.register('.html', YUI);
    * @static
    * @method YUI.render
    */
    YUI.render = function(content, options) {

        var eY, locals = options.locals;
        if (locals.instance) {
            eY = locals.instance;
            eY.use('node', 'substitute');
        } else {
            eY = YUI({ debug: DEBUG }).use('node', 'substitute');
            YUI._express[eY.id] = eY;
        };

        if (locals.instance) {
            if (!options.isLayout) {
                //TODO
                //eY.one('body').prepend('<div>' + content + '</div>');
                eY.one('body').prepend(content);
            } else {
                var html = eY.one('body').get('innerHTML');
                eY.one('body').set('innerHTML', content);
                content = html;
            }
        } else {
            eY.one('body').set('innerHTML', content);
        }

        if (options.isLayout) {
            var docType = YUI.defaultDocType;
            if (locals.docType) {
                if (YUI.docTypes[locals.docType]) {
                    docType = locals.docType;
                }
            }
            docType = YUI.docTypes[docType];
            var parts = eY.clone(YUI.partials);
            if (locals.partials) {
                locals.partials.forEach(function(p) {
                    parts.push(p);
                });
            }
            if (parts && parts.length) {
                eY.each(parts, function(p) {
                    var str = locals.partial(p.name);
                    var enum = p.enum || 'one';
                    var method = p.method || 'append';
                    eY[enum](p.node)[method](str);
                    if (p.fn) {
                        p.fn(eY, options, p);
                    }
                });
            }
            var html = docType + "\n";
            var content = eY.one(locals.content);
            if (content && locals.body) {
                //content.set('innerHTML', locals.body);
                content.prepend(locals.body);
            }
            if (locals.use) {
                eY.Get.domScript('/combo?' + locals.use.join('&') + ((locals.filter) ? '&filter=' + locals.filter : ''));
            }
            if (locals.after) {
                locals.after(eY, options, locals.partial);
            }
            html += eY.config.doc.outerHTML;
            if (locals.sub) {
              html = eY.substitute(html, locals.sub);
            }
            YUI._express[eY.id] = eY;
            YUI.cleanExpress();
            return html;
        } else {

            if (locals.before) {
                locals.before(eY, options, locals.partial);
            }
            return eY.one('body').get('innerHTML');
        }

    };

    var fs = YUI.require('fs');

    /**
    * Simple YUI based combo handler (only for YUI files and has a custom url signature)
    */
    YUI.comboCache = {};
    YUI.comboSent = {};

    /**
    * Method is designed to be dropped into an express get handler, should really be "combo": app.get('/combo', YUI.combo);
    * @method YUI.combo
    * @static
    */
    YUI.combo = function(req, res) {
        var filter = 'min';
        if (req.query.filter) {
            filter = req.query.filter;
            delete req.query.filter;
        }
        var keys = Y.Object.keys(req.query),
            fileCount = 0, files = [];

        //This is a bug, seems that event and base are not added to the combo'd out list.
        keys.push('yui-base', 'loader', 'event', 'base');

        YUI({ debug: false, filter: 'min' }).use('loader', 'oop', function(Y) {

            var loader = new Y.Loader({
                ignoreRegistered: true,
                require: keys,
                force: keys.concat("yui-base", "loader", 'oop', 'yui-throttle', 'intl', 'get'),
                allowRollup: true,
                filter: filter,
                loadOptional: false,
                combine: false
            });
            loader.base = Y.config.base;
            loader.calculate();

            var s = loader.sorted, l = s.length, m, surl, out = [], i;
            if (l) {
                for (i=0; i <l; i=i+1)  {
                    m = loader.moduleInfo[s[i]];
                    if (s[i].indexOf('nodejs') === -1) {
                        if (m && m.type == 'js') {
                            surl = m.fullpath || loader._url(m.path);
                            out.push(surl);
                        }
                    }
                }
            }

            var sendRequest = function() {
                if (fileCount == out.length) {
                    //console.log('Files are all done..');
                    var body = files.join("\n");
                    var status = 200;

                    if (YUI.comboSent[req.url]) {
                        //status = 304;
                    }
                    YUI.comboSent[req.url] = true;
                    res.send(body, {
                        'Content-Type': 'application/x-javascript',
                        //'Content-Type': 'text/plain',
                        'Content-Length': body.length,
                        'Cache-Control': 'max-age=315360000',
                        'Vary': 'Accept-Encoding',
                        'Date': new Date(),
                        'Expires': new Date((new Date()).getTime() + (60 * 60 * 1000 * 365 * 10)),
                        'Age': '300',
                        'X-YUI-Combo': req.url
                    }, status);
                }
            };

            Y.each(out, function(v, k) {
                f = v;
                if (YUI.comboCache[f]) {
                    //console.log('File Loaded from cache (' + k + '): ' + out[k]);
                    fileCount++;
                    files[k] = YUI.comboCache[f];
                    sendRequest();
                } else {
                    fs.readFile(f, encoding="utf8", Y.rbind(function(err, data, index, fileName) {
                        fileCount++;
                        if (err) {
                            index = data;
                            fileName = index;
                        }
                        //console.log('File Loaded from disk (' + index + '): ' + out[index]);
                        if (err) {
                            //console.log('Throw Error: ', out[index]);
                            //throwError(err, out[index]);
                        } else {
                            files[index] = data;
                            YUI.comboCache[fileName] = data;
                        }
                        sendRequest();
                    }, Y, k, f));
                }
            });


        });

    };

}, 'NODE');
