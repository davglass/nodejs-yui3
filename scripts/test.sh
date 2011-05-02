#!/bin/bash

if [ -d "./tests/node_modules" ]; then
    echo "Found ./tests/node_modules, removing it"
    rm -rRf ./tests/node_modules
    wait
fi

if [ ! -d "./build/full" ]; then
    echo "No current build found, building"
    make full
    wait
fi

cd tests;
echo "Installing latest build locally for testing"
npm i ../build/full --loglevel silent
echo "Installing yuitest locally"
npm i yuitest --loglevel silent
echo "Installing gallery"
npm i yui3-gallery@2010.09.22 --loglevel silent
echo "Installing 2in3"
npm i yui3-2in3 --loglevel silent
wait
cd ../

#Checking Dependencies
./tests/deps.js
if test $? -gt 0; then
    echo "Test dependencies failed.."; exit 1;
fi

./tests/node_modules/.bin/yuitest ./tests/*.js
