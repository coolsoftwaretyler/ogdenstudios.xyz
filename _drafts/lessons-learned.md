---
layout: post
title: 'Lessons learned: '
tags: ['']
description: ''
---

## Title


Gulp 

https://www.browsersync.io/docs/gulp

https://www.liquidlight.co.uk/blog/how-do-i-update-to-gulp-4/

```
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// Style paths
var sassFiles = 'scss/**/*.scss'
var cssDest = 'css';

// Gulp task to process styles 
gulp.task('styles', function (done) {
    gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest))
        // Use stream since browsersync only cares about when files are finished compiling
        .pipe(browserSync.stream());
        done();
});

gulp.task('default', gulp.series('styles', function(){

    browserSync.init({
        server: './'
    });

    gulp.watch(sassFiles, gulp.series('styles'));
    gulp.watch('*.html').on('change', browserSync.reload);
}));
```

https://medium.com/@brockreece/scoped-styles-with-v-html-c0f6d2dc5d8e