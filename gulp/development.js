'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        js: [appRoot + '/src/**/*.js'],
        jsTests: [appRoot + '/test/**/*-test.js']
    };

var defaultTasks = ['env:development', 'dev:jshint', 'dev:mocha', 'dev:watch'];

gulp.task('env:development', () => {
    process.env.NODE_ENV = 'development';
});

gulp.task('dev:jshint', () => {
    return gulp.src(paths.js.concat(paths.jsTests))
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('dev:mocha', ['dev:jshint'], function (cb) {
    gulp.src(paths.jsTests)
        .pipe(plugins.plumber())
        .pipe(plugins.mocha())
});

gulp.task('dev:watch', () => {
    gulp.watch(paths.js.concat(paths.jsTests), ['development', 'dev:mocha'])
});

gulp.task('development', defaultTasks);

