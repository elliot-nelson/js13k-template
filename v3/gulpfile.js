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
//
// I prefer to name my tasks with colons (foo:bar:baz), which doesn't mesh well
// with gulp v4's preference for named functions as tasks. These helpers bridge
// the gap and keep my tasks nice and clean, even though I'm being a
// stick-in-the-mud and basically defining them "v3 style".
// -----------------------------------------------------------------------------
const tasks = {};
module.exports = tasks;

const task = (name, fn) => {
    tasks[name] = fn;
    fn.displayName = name;
}
const normalize = arg => {
    if (typeof arg === 'string') {
        if (tasks[arg]) return tasks[arg];
        throw new Error('No such task: ' + arg);
    }
    return arg;
}
const series = (...args) => {
    return gulp.series(...args.map(name => normalize(name)));
}
const parallel = (...args) => {
    return gulp.parallel(...args.map(name => normalize(name)));
}

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
