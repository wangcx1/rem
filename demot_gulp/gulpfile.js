var gulp = require('gulp'),
    mincss = require('gulp-mini-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    postcss=require('gulp-postcss');

var src_css = './src/css',
    dest_css = './dest/css',
    src_js = './src/js',
    dest_js = './dest/js';

gulp.task('mincss', function () {
    var processors=[];
    gulp.src(src_css + '/**/*.css')
        .pipe(mincss())
        .pipe(postcss(processors))
        .pipe(gulp.dest(dest_css));
});

gulp.task('minjs', function () {
    gulp.src(src_js + '/**/*.js')
        .pipe(uglify())
        .pipe(concat("all.min.js"))
        .pipe(gulp.dest(dest_js));
});

gulp.task('default', gulp.parallel('minjs','mincss'));
// gulpfile.js
// const gulp = require('gulp'),
//     mincss = require('gulp-mini-css'),
//     uglify = require('gulp-uglify'),
//     concat = require('gulp-concat');
// var src_css = './src/css',
//     dest_css = './dest/css',
//     src_js = './src/js',
//     dest_js = './dest/js';
// gulp.task('default', defaultTask);
//
// function defaultTask(done) {
//     gulp.src(src_js + '/**/*.js')
//         .pipe(uglify())
//         .pipe(concat("all.min.js"))
//         .pipe(gulp.dest(dest_js));
//     done();
// }