'use strict';

var PARAMS_DEF = require('./default-params');

module.exports = function () {
    return PARAMS_DEF.reduce(function (prev, curr) {

        var value = process.env['NSCONF_' + curr.name.toUpperCase()];
        if (value) prev[curr.name] = value;
        return prev;
    }, {});
};