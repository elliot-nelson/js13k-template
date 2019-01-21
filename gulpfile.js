// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
const gulp     = require('gulp');
const fs       = require('fs');

// -----------------------------------------------------------------------------
// Gulp Plugins
// -----------------------------------------------------------------------------
const advzip   = require('gulp-advzip');
const concat   = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const htmlmin  = require('gulp-htmlmin');
const size     = require('gulp-size');
const template = require('gulp-template');
const terser   = require('gulp-terser');
const zip      = require('gulp-zip');

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// CSS Build
// -----------------------------------------------------------------------------
task('build:css', () => {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.css'))
        .pipe(cleancss())
        .pipe(size({ title: 'CSS' }))
        .pipe(gulp.dest('temp'));
});

// -----------------------------------------------------------------------------
// JS Build
// -----------------------------------------------------------------------------
task('build:js', () => {
    return gulp.src('src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(terser())
        .pipe(size({ title: 'JS' }))
        .pipe(gulp.dest('temp'));
});

// -----------------------------------------------------------------------------
// HTML Build
// -----------------------------------------------------------------------------
task('build:html', () => {
    const cssContent = fs.readFileSync('temp/app.css');
    const jsContent = fs.readFileSync('temp/app.js');

    return gulp.src('src/index.html')
        .pipe(template({ css: cssContent, js: jsContent }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/dev'));
});

// -----------------------------------------------------------------------------
// ZIP Build
// -----------------------------------------------------------------------------
task('build:zip', () => {
    return gulp.src('dist/dev/**')
        .pipe(size({ title: 'HTML' }))
        .pipe(zip('final.zip'))
        .pipe(size({ title: 'Zip (Before)' }))
        .pipe(advzip({ optimizationLevel: 4, iterations: 1000 }))
        .pipe(size({ title: 'Zip (After)' }))
        .pipe(gulp.dest('dist/zip'));
});

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------
task('build', series(parallel('build:css', 'build:js'), 'build:html', 'build:zip'));

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
