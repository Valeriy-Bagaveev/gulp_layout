'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var extender = require('gulp-html-extend');
var autoprefixer = require('gulp-autoprefixer');

var pub = './build/';
var src = './src/';

gulp.task('js', function () {
    gulp.src(src + 'js/**/*.*')
        .pipe(gulp.dest(pub + 'js/'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    gulp.src(src + 'styles/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(pub + 'css'))
        .pipe(browserSync.stream());
});

gulp.task('cssmin', function () {
    gulp.src('build/css/index.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css/'));
});

gulp.task('extend', function () {
    gulp.src(src + 'templates/*.html')
        .pipe(extender({annotations:true,verbose:false})) // default options  // Пример подключения: <!--@@include  = part/header.html-->
        .pipe(gulp.dest(pub))
        .pipe(browserSync.stream());

});

gulp.task('sync', function () {
    browserSync.init({
        server: {
            baseDir: pub
        },
        port: '4444',
        ghostMode: false,
        open: false,
        serveStatic: [src]
    });

    gulp.watch(
        [ '*.html' ],
        { cwd: pub },
        browserSync.reload
    );
});

gulp.task('watchers', function() {
    gulp.watch(src + 'styles/**/*.scss', ['sass']);
    gulp.watch(src + 'templates/**/*.html', ['extend']);
    gulp.watch(src + 'js/**/*.*', ['js']);
});

gulp.task(
    'default',
    [
        'watchers',
        'sass',
        // 'jade',
        'extend',
        'cssmin',
        // 'imagemin',
        'js',
        'sync'
    ]
);