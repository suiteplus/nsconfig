'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        js: [appRoot + '/src/**/*.js'],
        jsTests: [appRoot + '/test/**/*-test.js']
    };

var defaultTasks = ['env:test', 'test:jshint', 'test:coverage'];

gulp.task('env:test', function () {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.NODE_ENV = 'test';
});

gulp.task('test:jshint', function () {
    return gulp.src(paths.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('test:coverage', function () {
    var deferred = require('q').defer();

    let executeTests = function () {
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
    gulp.src(paths.js)
        .pipe(plugins.plumber())
        .pipe(plugins.istanbul({
            includeUntested: true,
            instrumenter: require('isparta').Instrumenter

        })) // Covering files
        .pipe(plugins.istanbul.hookRequire())// Force `require` to return covered files
        .on('finish', () => executeTests());
    return deferred.promise
});

gulp.task('test', defaultTasks);