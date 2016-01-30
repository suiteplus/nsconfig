'use strict';
var fs = require('fs'),
    _ = {
        extend: require('lodash.assign')
    },
    osenv = require('osenv'),
    path = require('path');

module.exports = function (params, arg2 , arg3) {
    params = params || {};

    var custom = {};
    var nothrow = false;
    if ( arguments.length === 2 && typeof arg2 == 'boolean' ) nothrow = arg2;
    else if (arguments.length === 2) custom = arg2;
    else if (arguments.length === 3) {
        nothrow = arg3;
        custom = arg2 || {};
    }

    var confFileGlobal = readConfFile(`${osenv.home()}/.ns/nsconfig.json`),
        confFileLocal = readConfFile(resolveLocalConfPath()),
        confEnvVars = readConfEnvVar();

    params = _.extend({}, confEnvVars, confFileGlobal, confFileLocal, params);
    params = checkParams(params, nothrow,custom);
    return params;
};

var PARAMS_DEF = [
    {name: 'email', required: true},
    {name: 'password', required: true, base64: true},
    {name: 'account', required: true},
    {name: 'realm', def: 'netsuite.com'},
    {name: 'role'}
]; //ps: default is reserved word

function resolveLocalConfPath() {
    function parent(pathstr) {
        var out = '';
        var pathobj = path.parse(pathstr);
        var split = pathobj.dir.split('/');
        for (var it = 0; it < split.length - 1; it++)
            out += split[it] + '/';
        return out + pathobj.base;
    }

    var pathobj = path.parse(process.cwd() + '/nsconfig.json');
    var trial = pathobj.dir + '/' + pathobj.base;
    for (var it = 0; it < 5; it++) {
        if (fs.existsSync(trial)) {
            module.exports.CONF_CWD = path.parse(trial).dir;
            return trial;
        }
        trial = parent(trial);
    }

    return '';
}

function readConfFile(path) {
    var out = {};
    if (!fs.existsSync(path)) return out;
    try {
        let content = fs.readFileSync(path);
        out = JSON.parse(content);
    } catch (e) {
        //purposely ignore
        //console.error(e);
    }

    return out;
}

function readConfEnvVar() {
    return PARAMS_DEF.reduce((prev, curr) => {

        var value = process.env[`NSCONF_${curr.name.toUpperCase()}`];
        if (value) prev[curr.name] = value;
        return prev;

    }, {});
}

function checkParams(params, nothrow, custom) {
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
}
