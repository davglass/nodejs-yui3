#!/bin/bash

echo "Publishing all.."
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
        echo "Publishing from: $dir";
        echo "npm publish $dir/"
        npm publish $dir/ --loglevel info
    fi
done

