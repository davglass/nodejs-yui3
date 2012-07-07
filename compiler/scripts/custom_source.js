#!/usr/bin/env node

var yui3 = require('yui3'),
    fs = require('fs'),
    path = require('path'),
    cli = require('cli'),
    start = (new Date()).getTime();

    post = path.join(__dirname, '../src/lib');

if (!fs.existsSync(post)) {
    fs.mkdirSync(post, 0777);
}


cli.enable('status', 'help');
cli.parse({
    modules: ['m', 'Required: Comma seperated list of modules to pass to YUI().use()', 'string'],
    filter: ['f', 'The file type to produce: debug, raw, min', 'string', 'min'],
    version: ['v', 'The YUI version to use', 'string', '3.3.0'],
    gversion: ['gv', 'The Gallery version to use', 'string'],
    yui2: ['yui2', 'The YUI2 version to use', 'string', '2.8.0']
});

var parseUse = function(u) {
    u = u.replace(/ /g, '').split(',');
    return u;
}

cli.main(function() {
    if (!this.options.modules) {
        cli.getUsage();
        return;
    }

    var opts = this.options;
    //Hack to make sure loader is in the queue
    var o = opts.modules.split(',');
    o.push('loader');
    opts.modules = o.join(',');
    var config = {
        m: opts.modules,
        v: opts.version,
        parse: true,
        filt: opts.filter,
        '2in3v': opts.yui2
    };
    config.env = 'get';

    if (opts.gversion) {
        config.gv = opts.gversion;
    }
    yui3.rls(config, function(err, data) {
        var size = 0;
        var d = [],
            pre = [],
            count = 0;
        console.log(data.js);
        for (var k in data.d) {
            size += data.d[k].length;
            if (count < 2) {
                pre.push(data.d[k]);
            } else {
                //d.push(data.d[k]);
                var parts = k.split('/');
                //Only test against minned files. all others will be loaded from disk
                var name = (parts[parts.length - 1]).replace(/-/g, '_').replace('_min.js', '');
                
                fs.writeFileSync(path.join(post, name + '.js'), data.d[k], encoding='utf8');
            }

            count++;
        };
        fs.writeFileSync(path.join(__dirname, '../src/yui.js'), pre.join('\n'), encoding='utf8');

        console.log('Files: ', d.length);
        console.log('Build Time: %sms', (new Date()).getTime() - start);
    });
    
});

