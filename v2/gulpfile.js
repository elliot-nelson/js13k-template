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

task('concat:ts', () => {
    return gulp.src([
        'src/ts/ambient.d.ts',
        'src/ts/Game.ts',
        'src/ts/WindowInterface.ts',
        'src/ts/index.ts'
    ]).pipe(concat('app.ts'))
    .pipe(gulp.dest('dist/ts'));
});

task('compile:ts', () => {
   const project = typescript.createProject('tsconfig.json');
   return project.src()
       .pipe(project()).js
       .pipe(gulp.dest('dist/js'));
});

task('build:js', series('concat:ts', 'compile:ts'));
