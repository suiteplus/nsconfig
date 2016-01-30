'use strict';

var fs = require('fs');

module.exports = function (path) {
    var out = {};
    if (!fs.existsSync(path)) return out;
    try {
        var content = fs.readFileSync(path);
        out = JSON.parse(content);
    } catch (e) {
        //purposely ignore
        //console.error(e);
    }

    return out;
};