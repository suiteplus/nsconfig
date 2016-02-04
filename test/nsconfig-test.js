'use strict';

var fs = require('fs'),
    nsconfig = require('../.'),
    should = require('should'),
    osenv = require('osenv'),
    cp = require('cp'),
    rimraf = require('rimraf');

function myrand() {
    return Math.ceil(Math.random() * 1000);
}

describe('<nsconfig Tests>', () => {

    function cpIfExists(path, inverse) {
        var ext1 = inverse ? '.temp' : '';
        var ext2 = inverse ? '' : '.temp';
        if (fs.existsSync(path + ext1)) {
            cp.sync(path + ext1, path + ext2);
        }
    }

    //backups your files
    before(() => {
        try {
            fs.mkdirSync(`${osenv.home()}/.ns`);
        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }

        cpIfExists(`${osenv.home()}/.ns/nsconfig.json`);
        cpIfExists('./nsconfig.json');

        var envBackup = Object.keys(process.env).reduce((prev, key) => {
            if (key.startsWith('NSCONF_')) prev[key] = process.env[key];
            return prev;
        }, {});

        fs.writeFileSync('nsconfigenv.json.temp', JSON.stringify(envBackup));
    });

    //restores your files
    after(() => {
        cpIfExists(`${osenv.home()}/.ns/nsconfig.json`, true);
        cpIfExists('./nsconfig.json', true);

        try {
            var envBackup = fs.readFileSync('nsconfigenv.json.temp');
            envBackup = JSON.parse(envBackup);
            Object.keys(envBackup).forEach(key => {
                process.env[key] = envBackup[key];
            }, {});
        } catch (e) {
            //ignore for now
        }

        //rimraf.sync(`${osenv.home()}/.ns/nsconfig.json.temp`);
        //rimraf.sync('./nsconfig.json.temp');
        rimraf.sync('./nsconfig.json');
        //rimraf.sync('nsconfigenv.json.temp');
    });

    beforeEach(() => {
        fs.writeFileSync(`${osenv.home()}/.ns/nsconfig.json`, '');
        fs.writeFileSync('./nsconfig.json', '');
        Object.keys(process.env).forEach(key => {
            if (key.startsWith('NSCONF_')) process.env[key] = '';
        });
    });

    describe('Reading the config files... ', () => {

        it('reads email and raw password from global config file', () => {
            var name = `globalemail${myrand()}`,
                passw = 'opalegal';

            fs.writeFileSync(`${osenv.home()}/.ns/nsconfig.json`,
                JSON.stringify({email: name, password: passw})
            );
            var params = nsconfig({}, true);

            should(params).have.property('email', name);
            should(params).have.property('password', passw);
        });

        it('reads email and hash password from global config file', () => {
            var name = `globalemail${myrand()}`,
                passw = 'opalegal',
                passwHash = new Buffer(passw).toString('base64');

            fs.writeFileSync(`${osenv.home()}/.ns/nsconfig.json`,
                JSON.stringify({email: name, passwordHash: passwHash})
            );
            var params = nsconfig({}, true);

            should(params).have.property('email', name);
            should(params).have.property('password', passw);
        });

        it('reads email from local config file', () => {
            var name = `localemail${myrand()}`;

            fs.writeFileSync('./nsconfig.json',
                JSON.stringify({email: name})
            );
            var params = nsconfig({}, true);

            should(params).have.property('email', name);
        });

        it('reads email from environment variable', () => {
            var name = `localemail${myrand()}`;
            process.env.NSCONF_EMAIL = name;
            var params = nsconfig({}, true);

            should(params).have.property('email', name);
        });

        it('reads hashed password from environment variable', () => {
            var pass = 'foobar';
            var hahsed = new Buffer(pass).toString('base64');
            process.env.NSCONF_PASSWORD = hahsed;
            var params = nsconfig({}, true);

            should(params).have.property('password', pass);
        });

        it('overrides global setting with local ones', () => {
            var nameGlobal = `globalemail${myrand()}`;
            fs.writeFileSync(`${osenv.home()}/.ns/nsconfig.json`,
                JSON.stringify({email: nameGlobal})
            );

            var nameLocal = `localemail${myrand()}`;
            fs.writeFileSync(`./nsconfig.json`,
                JSON.stringify({email: nameLocal})
            );

            var params = nsconfig({}, true);

            console.log(params);

            should(params).have.property('email', nameLocal);
        });

        it('overrides everything with env variables', () => {
          var email = 'my@email.com';
          process.env.NSCONF_EMAIL = email;

          var nameLocal = `localemail${myrand()}`;
          fs.writeFileSync(`./nsconfig.json`,
              JSON.stringify({email: nameLocal})
          );
          var params = nsconfig({email: 'not@mine.gov'}, true);

          should(params).have.property('email', email);
        });

        it('use a custom required parameter. Fail on it.', function () {
            this.timeout(10000);

            should(function () {
                nsconfig({}, [{name: 'anyparams', required: true}]);
            }).throw();
        });
    });
});