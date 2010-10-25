/**
* A NodeJS transport for IO
* @module io-nodejs
*/
YUI.add('io-nodejs', function(Y) {
    var url = YUI.require('url'),
        http = YUI.require('http');

    var NodeTransport = {
        id: 'nodejs',
        src: {
            send: function(uri, transactionObject, config) {
                //Y.log(sys.inspect(transactionObject), 'info', 'nodeio');
                //Y.log(sys.inspect(config), 'info', 'nodeio');
                
                Y.io.xdrResponse(transactionObject, config, 'start');
                
                var urlInfo = url.parse(uri, parseQueryString=false);
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers.host = urlInfo.hostname;

                if (config.data && config.method === 'POST') {
                    config.headers['Content-Length'] = config.data.length;
                    config.headers = Y.merge({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, config.headers);
                }
                
                var host = http.createClient(YUI.urlInfoPort(urlInfo), urlInfo.hostname);
                
                var req_url = urlInfo.pathname;
                if (urlInfo.search) {
                    req_url += urlInfo.search;
                }
                Y.log('Requesting (' + config.method + '): ' + urlInfo.hostname, 'info', 'nodeio');
                Y.log('URL: ' + req_url, 'info', 'nodeio');

                
                var request = host.request(config.method, req_url, config.headers);
                request.socket.addListener('error', function(socketException) {
                    /*ECONNREFUSED*/
                    if (socketException.errno === 61) {
                        Y.log('ECONNREFUSED: connection refused to ' + request.socket.host + ':' + request.socket.port, 'error', 'nodeio');
                    } else {
                        Y.log(socketException, 'error', 'nodeio');
                    }
                    Y.io.xdrResponse(transactionObject, config, 'failure');
                });

                request.addListener('response', function (response) {
                    switch (response.statusCode) {
                        case 301:
                        case 302:
                            if (response.headers.location) {
                                Y.log('Status code (' + response.statusCode + ') redirecting to: ' + response.headers.location, 'info', 'nodeio');
                                NodeTransport.src.send(response.headers.location, transactionObject, config);
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
                        //sys.print(sys.inspect(transactionObject.c));

                    
                        Y.io.xdrResponse(transactionObject, config, 'complete');
                        Y.io.xdrResponse(transactionObject, config, ((good) ? 'success' : 'failure'));
                    
                        //TODO
                        //Y.io.xdrResponse(transactionObject, configurationObject, 'timeout');
                    });

                });
                if (config.method === 'POST') {
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

    Y.io.transport(NodeTransport);

}, 'NODE', { requires: ['io', 'io-xdr'], after: ['io-xdr'] });

