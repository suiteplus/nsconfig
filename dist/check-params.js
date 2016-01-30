'use strict';

var PARAMS_DEF = require('./default-params');

module.exports = function (params, nothrow, custom) {
    var defs = PARAMS_DEF.concat(custom || []);

    return defs.reduce(function (prev, curr) {
        var value = params[curr.name];

        if (!value && curr.base64) {
            var hash = params[curr.name + 'Hash'];
            if (hash) {
                value = new Buffer(hash, 'base64').toString();
            }
        }
        if (!value && curr.required && !nothrow) {
            throw Error('No ' + curr.name + ' defined.');
        }
        prev[curr.name] = value || curr.def;
        return prev;
    }, {});
};