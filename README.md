# nsconfig [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Load Netsuite Auth Configuration

## Required

 * node.js 0.10+ or io.js 1+ or node.js 4+

## Install [![Dependency Status][david-image]][david-url] [![devDependency Status][david-image-dev]][david-url-dev]
```bash
    npm install nsconfig
```

## Usage
```javascript
	var nsconfig = require('nsconfig');

	// read NetSuite Configurations
	var params = nsconfig({}, true);
	console.log('email:', params.email);
	console.log('password:', params.password);
	console.log('account:', params.account);
	console.log('realm:', params.realm); // default: 'system.netsuite.com'
	console.log('role:', params.role);
```

## Input options

The parameters may be stored in `~/.ns/nsconfig.json`, in environment variables, or passed directly.

For environment variables, prefix the options with "NSCONF_" and write in uppercase.

The following priority is taken for each parameter (using `_.extend`)

 1. Direct code input

 2. `./nsconfig.json`, then `../nsconfig.json`, up to 3 levels.

 2. `~/.ns/nsconfig.json`

 3. Environment variables

## Output
```json
	{
		"email": "email@suiteplus.com",
		"password": "*****",
		"account": "DDAA12321",
		"realm": "system.netsuite.com",
		"role": "Administrator"
	}
```

[travis-url]: https://travis-ci.org/suiteplus/nsconfig
[travis-image]: https://img.shields.io/travis/suiteplus/nsconfig.svg

[coveralls-url]: https://coveralls.io/r/suiteplus/nsconfig
[coveralls-image]: http://img.shields.io/coveralls/suiteplus/nsconfig/master.svg

[david-url]: https://david-dm.org/suiteplus/nsconfig
[david-image]: https://david-dm.org/suiteplus/nsconfig.svg

[david-url-dev]: https://david-dm.org/suiteplus/nsconfig#info=devDependencies
[david-image-dev]: https://david-dm.org/suiteplus/nsconfig/dev-status.svg

[npm-url]: https://npmjs.org/package/nsconfig
[npm-image]: http://img.shields.io/npm/v/nsconfig.svg