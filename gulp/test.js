'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        jsSrc: [`${appRoot}/src/**/*.js`],
        jsDist: [`${appRoot}/dist/**/*.js`],
        jsTests: [`${appRoot}/test/**/*-test.js`]
    };

gulp.task('test', ['env:test', 'test:babel', 'test:jshint', 'test:coverage']);

gulp.task('env:test', () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.NODE_ENV = 'test';
});

gulp.task('test:jshint', () => {
    return gulp.src(paths.jsSrc)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('test:coverage', ['test:jshint'], () => {
    let deferred = require('q').defer();
    
    let executeTests = () => {
        gulp.src(paths.jsTests)
            .pipe(plugins.plumber())
            .pipe(plugins.mocha({
                reporters: 'spec'
            }))
            .pipe(plugins.istanbul.writeReports({
                reports: ['lcovonly']
            })); // Creating the reports after tests runned
    };

    // instrumentation *.js
    gulp.src(paths.jsSrc)
        .pipe(plugins.plumber())
        .pipe(plugins.istanbul({
            includeUntested: true

        })) // Covering files
        .pipe(plugins.istanbul.hookRequire())// Force `require` to return covered files
        .on('finish', () => executeTests());
    return deferred.promise;
});