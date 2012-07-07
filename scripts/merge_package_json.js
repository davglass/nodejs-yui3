#!/usr/bin/env node

var fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    path = require('path'),
    exists = fs.existsSync,
    argv = process.argv.splice(2);

if (argv.length === 0) {
    console.log('Pass a package type to merge..');
    process.exit(1);
}

var pack = argv[0];
var main = fs.readFileSync('./packages/default-package.json', encoding='utf8');
if (exists('./packages/' + pack + '-package.json')) {
    var other = fs.readFileSync('./packages/' + pack + '-package.json', encoding='utf8');
} else {
    console.log('Can not find package: ', pack);
    process.exit(1);
}
try {
    main = JSON.parse(main);
} catch (e) {
    console.log('default-package.json file failed to be parsed');
    process.exit(1);
}
try {
    other = JSON.parse(other);
} catch (e) {
    console.log(pack + '-package.json file failed to be parsed');
    process.exit(1);
}

for (var i in other) {
    main[i] = other[i];
}

//var outData = sys.inspect(main, false, Infinity);
var outData = JSON.stringify(main);

outData = outData.replace(/,/g, ',\n\t').replace(/{/g, '{\n').replace(/\[/g, '[\n');

if (exists('./build/' + pack)) {
    fs.writeFileSync(path.join('./build/', pack, 'package.json'), outData);
} else {
    console.log('Failed to locate the build directory: ./build/' + pack);
    process.exit(1);
}
