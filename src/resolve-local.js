'use strict';
var fs = require('fs'),
    path = require('path');

module.exports = function resolveLocal(fileName, opts) {
    if (!opts) opts = {};
    function parent(pathstr) {
        var out = '';
        var pathobj = path.parse(pathstr);
        var split = pathobj.dir.split('/');
        for (var it = 0; it < split.length - 1; it++)
            out += split[it] + '/';
        return out + pathobj.base;
    }

    var pathobj = path.parse(process.cwd() + '/' + fileName);
    var trial = pathobj.dir + '/' + pathobj.base;
    for (var it = 0; it < 5; it++) {
        if (fs.existsSync(trial)) {
            opts.CONF_CWD = path.parse(trial).dir;
            return trial;
        }
        trial = parent(trial);
    }

    return '';
};
