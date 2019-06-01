// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const advpng            = require('imagemin-advpng');
const fs                = require('fs');
const gulp              = require('gulp');

// -----------------------------------------------------------------------------
// Gulp Plugins
// -----------------------------------------------------------------------------
const advzip            = require('gulp-advzip');
const concat            = require('gulp-concat');
const cleancss          = require('gulp-clean-css');
const htmlmin           = require('gulp-htmlmin');
const ifdef             = require('gulp-ifdef');
const imagemin          = require('gulp-imagemin');
const size              = require('gulp-size');
const sourcemaps        = require('gulp-sourcemaps');
const stripImportExport = require('gulp-strip-import-export');
const template          = require('gulp-template');
const terser            = require('gulp-terser');
const typescript        = require('gulp-typescript');
const zip               = require('gulp-zip');

// -----------------------------------------------------------------------------
// Gulpfile
// -----------------------------------------------------------------------------
const { task, series, parallel } = require('./gulptask');
module.exports = task.exports;

// -----------------------------------------------------------------------------
// JS Build
// -----------------------------------------------------------------------------
const sources = [
    'src/ts/ambient.d.ts',
    'src/ts/KeyboardInput.ts',
    'src/ts/Input.ts',
    'src/ts/Game.ts',
    'src/ts/index.ts'
];
const tsoptions = {
    module: 'es6',
    noImplicitAny: true,
    target: 'es2018'
};
const tsdev = typescript.createProject(tsoptions);
const tsprod = typescript.createProject(tsoptions);
task('build:js:dev', () => {
    return gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(tsdev()).js
        .pipe(stripImportExport())
        //.pipe(ifdef({ DEBUG: true }, { extname: ['js'], verbose: false }))
        .pipe(concat('app.dev.js'))
        //.pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/temp'));
});
task('build:js:prod', () => {
    return gulp.src(sources)
        .pipe(sourcemaps.init())
        .pipe(tsprod()).js
        .pipe(stripImportExport())
        //.pipe(ifdef({ DEBUG: false }, { extname: ['js'], verbose: false }))
        .pipe(concat('app.prod.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/temp'));
});
task('build:js', parallel('build:js:dev', 'build:js:prod'));

// -----------------------------------------------------------------------------
// CSS Build
// -----------------------------------------------------------------------------
task('build:css', () => {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.css'))
        .pipe(cleancss())
        .pipe(gulp.dest('dist/temp'));
});

// -----------------------------------------------------------------------------
// HTML Build
// -----------------------------------------------------------------------------
task('build:html:dev', () => {
    const cssContent = fs.readFileSync('dist/temp/app.css');
    const jsContent = fs.readFileSync('dist/temp/app.dev.js');

    return gulp.src('src/index.html')
        .pipe(template({ css: cssContent, js: jsContent }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/dev'));
});
task('build:html:prod', () => {
    const cssContent = fs.readFileSync('dist/temp/app.css');
    const jsContent = fs.readFileSync('dist/temp/app.prod.js');

    return gulp.src('src/index.html')
        .pipe(template({ css: cssContent, js: jsContent }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/prod'));
});
task('build:html', parallel('build:html:dev', 'build:html:prod'));

// -----------------------------------------------------------------------------
// ZIP Build
// -----------------------------------------------------------------------------
task('build:zip', () => {
    return gulp.src(['dist/prod/*.html'])
        .pipe(size())
        .pipe(zip('final.zip'))
        .pipe(advzip({ optimizationLevel: 4, iterations: 1000 }))
        .pipe(size({ title: 'zip' }))
        .pipe(gulp.dest('dist/zip'));
});

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------
task('build', series(
    parallel('build:css', 'build:js' /*, 'build:assets' */),
    'build:html',
    'build:zip'
));

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
task('watch', () => {
    gulp.watch('src/**', series('build'));
});

// -----------------------------------------------------------------------------
// Default
// -----------------------------------------------------------------------------
task('default', series('build', 'watch'));
