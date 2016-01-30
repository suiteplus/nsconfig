# nsconfig [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Configuration options for netsuite-related packages.

Set up authentication and custom parameters environment-wise or project-wise.

## Required

 * node.js 0.10+ or io.js 1+ or node.js 4+

## Install [![Dependency Status][david-image]][david-url] [![devDependency Status][david-image-dev]][david-url-dev]
```bash
    npm install nsconfig
```

## Usage

### nsconfig( overrideParams : any , projectParams? : ParamsDef[] , noThrow? : boolean )

Reads configuration parameters from the following sources (overriding each parameter on the same order):

  *  `overrideParams` argument;

  *  Searches up to 5 levels above cwd for a `nsconfig.json` file

  *  Searches for a `~/.ns/nsconfig.json` (on windows `~` is `X:/Users/<user>`)

  *  Searches for environment variables. In this case, parameters are uppercased and prefixed with `NSCONF_`.

__projectParams__

Set additional parameters that your module may want to look up.

The default parameters are:

```javascript
[
    {name: 'email', required: true},
    {name: 'password', required: true},
    {name: 'account', required: true},
    {name: 'realm', def: 'system.netsuite.com'},
    {name: 'role'}
]
```
Currently accepted options for each custom parameter are:

```typescript
interface ParamsDef {
	name : string;
	required? : boolean; //throws an error if this parameter is not defined
	def? : boolean;      //defaults to this value if this parameter is not defined
}
```

### Output example

See two configurations files:

  * _Raw password:_ [nsconfig.json](./example/nsconfig-simple.json)
  * _Hash password:_ [nsconfig.json](./example/nsconfig-hash.json)

	var params = nsconfig()

```json
{
	"email": "email@suiteplus.com",
	"password": "*****",
	"account": "DDAA12321",
	"realm": "system.netsuite.com",
	"role": 3
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