'use strict';

var fs = require('fs'),
    vm = require('vm');

module.exports = function (path) {
    var out = {};
    if (!fs.existsSync(path)) return out;
    try {
        var content = fs.readFileSync(path),
            context = vm.createContext({ out: out }),
            code = 'out.json = ' + content + ';';
        vm.runInContext(code, context, path);
    } catch (e) {
        //purposely ignore
        console.error(e);
    }

    return out.json;
};