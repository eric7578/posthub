"use strict"

// Thrift does not generate var where required in node.js
// source: https://issues.apache.org/jira/browse/THRIFT-1840

var path = require('path');
var fs = require('fs');

// read file list
//var findExports = /^[^var ]([\w_]+)(?!prototype)( = )/gm;

var findExports = /^([\w]+)( = )/gm;
fs.readdir(__dirname, function (err, files) {
  if (!err) {
    files.map(function(value, key, collection) {
      if (value === 'thrift_fix.js') {
        return;
      }

      value = path.join(__dirname, value);
      fs.readFile(value, { encoding: 'utf8' }, function (err, content) {
        if (content && !err) {
          var newContent = content.replace(findExports, 'var $1$2');
          newContent = (/^"use strict"/.test(newContent) ? newContent : "\"use strict\";\n" + newContent);
          console.log('Fixing file: ', value);
          fs.writeFile(value, newContent, function (err) {
            if (err) console.log('Unable to write to file ', value);
          });
        } else {
          console.log('No content from file: ', value);
          if (err) console.log('Error reading file: ', err);
        }
      });
    });
  } else {
    console.log('Error reading dir: ', err);
  }
});
