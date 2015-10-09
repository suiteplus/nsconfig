'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        js: [appRoot + '/src/**/*.js'],
        jsTests: [appRoot + '/test/**/*-test.js']
    };

var defaultTasks = ['env:development', 'dev:jshint', 'dev:mocha', 'watch'];

gulp.task('env:development', function () {
    process.env.NODE_ENV = 'development';
});

gulp.task('dev:jshint', function () {
    return gulp.src(paths.js.concat(paths.jsTests))
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('dev:mocha', function (cb) {
    gulp.src(paths.jsTests)
        .pipe(plugins.plumber())
        .pipe(plugins.mocha())
});

gulp.task('watch', function () {
    gulp.watch(paths.js.concat(paths.jsTests), ['development', 'dev:mocha'])
});

gulp.task('development', defaultTasks);

