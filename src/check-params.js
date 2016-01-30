'use strict';
var PARAMS_DEF = require('./default-params');

module.exports = function (params, nothrow, custom) {
    var defs = PARAMS_DEF.concat(custom || []);

    return defs.reduce((prev, curr) => {
        var value = params[curr.name];

        if (!value && curr.base64) {
            value = params[curr.name + 'Hash']
        }
        if (!value && curr.required && !nothrow) {
            throw Error(`No ${curr.name} defined.`);
        }
        prev[curr.name] = value || curr.def;
        return prev;

    }, {});
};
