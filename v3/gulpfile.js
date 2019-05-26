// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const gulp       = require('gulp');
const fs         = require('fs');

// -----------------------------------------------------------------------------
// Gulp Plugins
// -----------------------------------------------------------------------------
const advpng     = require('imagemin-advpng');
const advzip     = require('gulp-advzip');
const concat     = require('gulp-concat');
const cleancss   = require('gulp-clean-css');
const htmlmin    = require('gulp-htmlmin');
const ifdef      = require('gulp-ifdef');
const imagemin   = require('gulp-imagemin');
const size       = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const template   = require('gulp-template');
const terser     = require('gulp-terser');
const typescript = require('gulp-typescript');
const zip        = require('gulp-zip');
const stripImportExport = require('gulp-strip-import-export');

// -----------------------------------------------------------------------------
// Helper Methods
// -----------------------------------------------------------------------------
const { task, series, parallel } = require('./helpers');
module.exports = task.exports;

// -----------------------------------------------------------------------------
// Typescript Project
// -----------------------------------------------------------------------------
const tsproject = typescript.createProject({
    module: 'es6',
    noImplicitAny: true,
    target: 'es2018'
});

// -----------------------------------------------------------------------------
// JS Build
// -----------------------------------------------------------------------------
task('build:js', () => {
    return gulp.src([
        'src/ts/ambient.d.ts',
        'src/ts/Input.ts',
        'src/ts/Game.ts',
        'src/ts/index.ts'
    ])
    .pipe(sourcemaps.init())
    .pipe(tsproject()).js
    .pipe(stripImportExport())
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});
