'use strict';
var fs = require('fs'),
    vm = require('vm');

module.exports = function (path) {
    var out = {};
    if (!fs.existsSync(path)) return out;
    try {
        let content = fs.readFileSync(path),
            context = vm.createContext({out}),
            code = `out.json = ${content};`;
        vm.runInContext(code, context, path);
    } catch (e) {
        //purposely ignore
        console.error('Failed parsing json at ' + path + '.');
    }

    return out.json;
};
