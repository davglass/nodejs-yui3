#!/bin/bash

pack=$1;

case $1 in
  base|bare|full) ;;
  *) echo "Invalid Package Name"; exit 1;;
esac

echo "Making YUI3 $pack package"

if test -d ./build/$pack; then
    rm -rRf ./build/$pack
fi

dir="./build/$pack/"

mkdir -p $dir

cp README.* $dir
wait
cp LICENSE $dir
wait
cp -R lib $dir
wait
#Copy yui3-yui3.js into main file

echo "" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
echo "/**" >> $dir/lib/node-yui3.js
echo "  Imported from ./lib/yui3-yui3.js" >> $dir/lib/node-yui3.js
echo "**/" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
cat $dir/lib/yui3-yui3.js >> $dir/lib/node-yui3.js
wait
rm $dir/lib/yui3-yui3.js

#Copy RLS into main file
echo "" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
echo "/**" >> $dir/lib/node-yui3.js
echo "  Imported from ./lib/yui3-rls.js" >> $dir/lib/node-yui3.js
echo "**/" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
echo "" >> $dir/lib/node-yui3.js
cat $dir/lib/yui3-rls.js >> $dir/lib/node-yui3.js
wait
rm $dir/lib/yui3-rls.js
wait
cp ./packages/$pack-package.json ${dir}package.json
wait
./scripts/merge_package_json.js $pack
wait
echo "Build Complete: $dir"
