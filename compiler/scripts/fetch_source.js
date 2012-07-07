#!/usr/bin/env node

var yui3 = require('yui3-core@3.3.0').path(),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    noop = function() {},
    copyFile = function(src, dest, cb) {
        var is = fs.createReadStream(src);
        var os = fs.createWriteStream(dest, { flags: 'a+' });
        util.pump(is, os, cb);
    },
    yui3_base = path.join(yui3, 'build'),
    pre = path.join(__dirname, '../src/yui.js'),
    post = path.join(__dirname, '../src/lib');

if (!fs.existsSync(post)) {
    fs.mkdirSync(post, 0777);
}

console.log('Reading Main Directory');
var dirs = fs.readdirSync(yui3_base);

var preFiles = [];
var finalFiles = [];

dirs.forEach(function(d) {
    if (d.indexOf('.') === 0) {
        return;
    }
    files = fs.readdirSync(path.join(yui3_base, d));
    files.forEach(function(file) {
        switch (file) {
            case 'text-data-accentfold-min.js':
            case 'text-min.js':
            case 'text-data-wordbreak-min.js':
            //Non-Ascii Characters, need to fix this in the C file
            return;
        }
        if (d === 'yui' || d === 'loader' || d === 'io') {
            if (file.indexOf(d + '-min.js') === 0) {
                preFiles.push(path.join(yui3_base, d, file));
            }
            return;
        } else {
            if (file.indexOf('-min.js') > 0) {
                finalFiles.push({ file: path.join(yui3_base, d, file), name: file.replace(/-/g, '_').replace('_min.js', '.js') });
            }
        }
    });
});

preFiles = preFiles.reverse(); //YUI needs to come first ;)

copyFile(preFiles[0], pre, function() {
    copyFile(preFiles[1], pre, noop);
});

var copy = function() {
    if (finalFiles.length) {
        var i = finalFiles.pop();
        copyFile(i.file, path.join(post, i.name), copy);
    }
}
console.log('Copying', finalFiles.length, 'files');
copy();

