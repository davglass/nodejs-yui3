YUI.add('external-foo', function(Y) {

    Y.log(__dirname, 'info', '__dirname');
    Y.log(__filename, 'info', '__filename');

    //console.log(require);
    //console.log(process);

    var sys = require('sys');
    sys.puts('PRINTED FROM INTERNAL REQUIRE WITH sys.puts');

    var config = require('./config');
    Y.log(config);
    config.foo('#1 Relative');

    var config = require(__dirname + '/config');
    Y.log(config);
    config.foo('#2 Full Dir Require');

    Y.log('EXTERNAL FOO LOADED');

}, '1.0.0', { requires: ['node'] });
