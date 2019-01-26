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

// -----------------------------------------------------------------------------
// CSS Build
// -----------------------------------------------------------------------------
task('build:css', () => {
    return gulp.src('src/css/*.css')
        .pipe(concat('app.css'))
        .pipe(cleancss())
        .pipe(size({ title: 'css' }))
        .pipe(gulp.dest('temp'));
});

// -----------------------------------------------------------------------------
// JS Build
// -----------------------------------------------------------------------------
task('build:js:dev', () => {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(ifdef({ DEBUG: true }, { extname: ['js'] }))
        .pipe(concat('app.dev.js'))
        .pipe(terser())
        .pipe(size({ title: 'js:dev' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('temp'));
});
task('build:js:prod', () => {
    return gulp.src('src/js/*.js')
        .pipe(ifdef({ DEBUG: false }, { extname: ['js'] }))
        .pipe(concat('app.prod.js'))
        .pipe(terser())
        .pipe(size({ title: 'js:prod' }))
        .pipe(gulp.dest('temp'));
});
task('build:js', parallel('build:js:dev', 'build:js:prod'));

// -----------------------------------------------------------------------------
// Assets (PNGs)
// -----------------------------------------------------------------------------
task('build:assets', () => {
    return gulp.src(['src/assets/*.png', '!src/assets/_*.png'])
        .pipe(imagemin({ use: advpng({ optimizationLevel: 4, iterations: 10 }) }))
        .pipe(size({ title: 'assets' }))
        .pipe(gulp.dest('dist/dev'))
        .pipe(gulp.dest('dist/prod'));
});

// -----------------------------------------------------------------------------
// HTML Build
// -----------------------------------------------------------------------------
task('build:html:dev', () => {
    const cssContent = fs.readFileSync('temp/app.css');
    const jsContent = fs.readFileSync('temp/app.dev.js');

    return gulp.src('src/index.html')
        .pipe(template({ css: cssContent, js: jsContent }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/dev'));
});
task('build:html:prod', () => {
    const cssContent = fs.readFileSync('temp/app.css');
    const jsContent = fs.readFileSync('temp/app.prod.js');

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
    return gulp.src('dist/prod/**')
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
    parallel('build:css', 'build:js', 'build:assets'),
    'build:html',
    'build:zip')
);

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
