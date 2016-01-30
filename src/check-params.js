'use strict';
var PARAMS_DEF = require('./default-params');

module.exports = function (params, nothrow, custom) {
    let defs = PARAMS_DEF.concat(custom || []);

    return defs.reduce((prev, curr) => {
        let value = params[curr.name];

        if (!value && curr.base64) {
            let hash = params[curr.name + 'Hash'];
            if (hash) {
                value = new Buffer(hash, 'base64').toString();
            }
        }
        if (!value && curr.required && !nothrow) {
            throw Error(`No ${curr.name} defined.`);
        }
        prev[curr.name] = value || curr.def;
        return prev;

    }, {});
};
