'use strict';

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    appRoot = process.cwd(),
    paths = {
        js: [`${appRoot}/src/**/*.js`],
        jsDist: `${appRoot}/dist`
    };

var defaultTasks = ['env:prod', 'prod:babel'];

gulp.task('env:prod', () => {
    process.env.NODE_ENV = 'production';
});

gulp.task('prod:babel', () => {
    return gulp.src(paths.js)
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.jsDist));
});

gulp.task('production', defaultTasks);