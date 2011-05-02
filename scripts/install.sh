#!/bin/bash

echo "With NPM 1.0 you can not require a global package, global install will not work"
exit 1;
#Deprecated
if ! test -d ./build; then
    echo "No build directory found"; exit 1;
fi
cd ./build
for dir in ./*; do
    if [ "$dir" = "./*" ]; then
        echo "No builds found in ./build dir"
        exit 1;
    fi
    if test -f $dir/package.json; then
        echo "Installing from: $dir";
        #echo "npm install $dir/ -g"
        #npm install $dir/ -g
    fi
done
