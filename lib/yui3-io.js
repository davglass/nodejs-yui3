/**
* A NodeJS transport for IO
* @module io-nodejs
*/
YUI.add('io-nodejs', function(Y) {
    var url = YUI.require('url'),
        http = YUI.require('http'),
        https;

    if (http.get) {
        https = YUI.require('https');
    }

    var NodeTransport = {
        id: 'nodejs',
        src: {
            send: function(uri, transactionObject, config) {
                //Y.log(sys.inspect(transactionObject), 'info', 'nodeio');
                //Y.log(sys.inspect(config), 'info', 'nodeio');

                Y.io.xdrResponse('start', transactionObject, config);
                
                var urlInfo = url.parse(uri, parseQueryString=false),
                    p = YUI.urlInfoPort(urlInfo);
                
                if (!config.method) {
                    config.method = 'GET';
                }
                config.method = config.method.toUpperCase();
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers = Y.merge(_headers, config.headers);
                config.headers.host = urlInfo.hostname + ((p !== 80) ? ':' + p : '');
                config.headers.host = config.headers.host || _headers.host;


                if (config.data) {
                    if (Y.Lang.isObject(config.data) && Y.QueryString) {
                        Y.log('Converting config.data Object to String', 'info', 'io');
                        config.data = Y.QueryString.stringify(config.data);
                    }
                    config.headers['Content-Length'] = config.data.length;
                    config.headers = Y.merge({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, config.headers);
                }
               
                var req_url = urlInfo.pathname;
                if (urlInfo.search) {
                    req_url += urlInfo.search;
                }
                Y.log('Requesting (' + config.method + '): ' + urlInfo.hostname, 'info', 'nodeio');
                if (http.get) { //0.4.0
                    Y.log('Using new 0.4.0 http.request', 'info', 'nodeio');
                    var h = ((urlInfo.protocol === 'https') || p === 443) ? https : http;

                    if (h === https) {
                        Y.log('Using HTTPS client', 'info', 'nodeio');
                    }
                    var request = h.request({
                        host: urlInfo.hostname,
                        port: p,
                        method: config.method,
                        path: req_url,
                        headers: config.headers
                    });
                    var s = request;
                } else {
                    var host = http.createClient(p, urlInfo.hostname, ((p === 443) ? true : false));
                    var request = host.request(config.method, req_url, config.headers);
                    var s = request.socket || request;
                }
                Y.log('URL: ' + req_url, 'info', 'nodeio');
                s.on('error', function(socketException) {
                    /*ECONNREFUSED*/
                    if (socketException.errno === 61) {
                        Y.log('ECONNREFUSED: connection refused to ' + urlInfo.hostname + ':' + p, 'error', 'nodeio');
                    } else {
                        Y.log(socketException, 'error', 'nodeio');
                    }
                    Y.io.xdrResponse('failure', transactionObject, config);
                });

                request.addListener('response', function (response) {
                    switch (response.statusCode) {
                        case 301:
                        case 302:
                            if (response.headers.location) {
                                var newUrl = response.headers.location;
                                if (newUrl.substr(0, 1) == '/') {
                                    newUrl = urlInfo.protocol + '/'+'/' + urlInfo.hostname + newUrl;
                                }
                                Y.log('Status code (' + response.statusCode + ') redirecting to: ' + newUrl, 'info', 'nodeio');
                                NodeTransport.src.send(newUrl, transactionObject, config);
                                return;
                            }
                            break;
                    }
                    //sys.puts("STATUS: " + response.statusCode);
                    //sys.puts("HEADERS: " + JSON.stringify(response.headers));
                    //response.setBodyEncoding("utf8");
                    var body = '';
                    response.addListener('data', function (chunk) {
                        //sys.puts('chunk: ' + chunk);
                        body += chunk;
                    });
                    response.addListener("end", function() {
                        var statusText, good, status = response.statusCode;

                        if (status >= 200 && status < 300) {
                            statusText = 'OK';
                            good = true;
                        } else {
                            statusText = 'Server Error';
                            good = false;
                        }

                        transactionObject.c = {
                            status: response.statusCode,
                            statusText: statusText,
                            responseText: body,
                            headers: response.headers,
                            getAllResponseHeaders: function() {
                                return this.headers;
                            },
                            getResponseHeader: function(h) {
                                return this.headers[h];
                            }
                        }
                        //Y.log(JSON.stringify(transactionObject.c, null, 2), 'warn', 'nodeio');
                        //sys.print(sys.inspect(transactionObject.c));
                        
                        //Hack around 3.4.0 removal of the complete event
		                var io = Y.io._map[transactionObject.uid];
                        io.complete(transactionObject, config);
                        
                        //Y.io.xdrResponse('complete', transactionObject, config);
                        Y.io.xdrResponse(((good) ? 'success' : 'failure'), transactionObject, config);
                    
                        //TODO
                        //Y.io.xdrResponse(transactionObject, configurationObject, 'timeout');
                    });

                });
                if (config.method !== 'GET') {
                    request.write(config.data);
                }
                if (request.end) {
                    request.end();
                } else {
                    request.close();
                }
            },
            abort: function() {
                //TODO
            },
            isInProgress: function() {
                //TODO
                return false;
            }
        }
    };

    /**
    * HACK - I don't like this, but this is the only way I can intercept io calls
    * and auto apply the xdr config option.
    */
    /*
    var _io = Y.io;
    Y.io = function(url, config) {
        if (!config) {
            config = {};
        }
        config.xdr = { use: 'nodejs' };
        if (this._transport) {
            this._transport['nodejs'] = NodeTransport;
        }        
        return _io(url, config);
    }
    for (var i in _io) {
        Y.io[i] = _io[i];
    }
    if (Y.io.transport) {
        Y.io.transport(NodeTransport);
    }
    
    var _headers = {};
    Y.io.header = function(name, value) {
        _headers[name] = value;
    };
    var _io = Y.io;

    Y.io = function(u, c) {
        c.xdr = { use: 'nodejs' };

        var o = Y.io._map['io:0'] || new Y.IO();
        o.transport(NodeTransport);
        console.error('Creating IO instance: ', Object.keys(o));
        console.error('Creating IO instance2: ', Object.keys(new Y.IO()));
        return o.send.apply(o, [u, c]);
    };
    for (var i in _io) {
        Y.io[i] = _io[i];
    }

    */

    var _send = Y.IO.prototype.send;

    Y.IO.prototype.send = function(url, config) {
        if (!config) {
            config = {};
        }
        config.xdr = { use: 'nodejs' };
        this._transport['nodejs'] = NodeTransport.src;
        return _send.call(this, url, config);
    };

    var _headers = {};
    Y.io.header = function(name, value) {
        _headers[name] = value;
    };


}, 'NODE', { requires: ['dom-base', 'io-base', 'io-xdr', 'querystring-stringify-simple'] });

