const concat = require('gulp-concat');
const gulp     = require('gulp');
const htmlmin  = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const zip      = require('gulp-zip');
const advzip   = require('gulp-advzip');
const size     = require('gulp-size');
const template = require('gulp-template');
const terser = require('gulp-terser');
const fs = require('fs');

function final() {
    return gulp.src('dist/**')
        .pipe(size({ title: 'Files' }))
        .pipe(zip('final.zip'))
        .pipe(size({ title: 'Zip (Before)' }))
        .pipe(advzip({ optimizationLevel: 4, iterations: 1000 }))
        .pipe(size({ title: 'Zip (After)' }))
        .pipe(gulp.dest('.'));
}

function css() {
    return gulp.src('src/*.css')
        .pipe(cleancss())
        .pipe(gulp.dest('temp'));
}
function js() {
    return gulp.src('src/*.js')
        .pipe(terser())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('temp'));
}

function html() {
    const cssContent = fs.readFileSync('temp/app.css');
    const jsContent = fs.readFileSync('temp/app.js');

    return gulp.src('src/*.html')
        .pipe(template({ css: cssContent, js: jsContent }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}

module.exports = {
    build: gulp.series(gulp.parallel(css, js), html, final)
};
