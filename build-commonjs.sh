#!/bin/bash
cat lib/*.js lib/collection/*.js lib/operator/*.js |sed -e "/^import /d" -e "s/^export //" > self-contained.js
echo "module.exports = {" > export.temp
cat self-contained.js | grep "^class " | sed -e "s/^class //" -e "s/ .*//" -e "s/^/  /" -e "s/$/,/" >> export.temp
cat self-contained.js | grep "^function" | grep -v "^function _" | sed -e "s/^ *function //" -e "s/(.*//" -e "s/^/  /" -e "s/$/,/" >> export.temp
echo "};" >> export.temp
cat export.temp >> self-contained.js
rm export.temp
