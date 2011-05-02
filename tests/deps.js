#!/usr/bin/env node

try {
    require('yui3');
} catch (e) {
    console.log('yui3 needs to be installed');
    process.exit(1);
}
try {
    require('yui3-2in3');
} catch (e) {
    console.log('yui3-2in3 needs to be installed');
    process.exit(1);
}
try {
    require('yuitest');
} catch (e) {
    console.log('yuitest needs to be installed');
    process.exit(1);
}
