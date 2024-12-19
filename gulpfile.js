const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

// Пути к файлам
const paths = {
    html: 'src/*.html',
    styles: {
        src: 'src/sass/**/*.+(scss|sass)',
        dest: 'src/css',
    },
};

// Локальный сервер
function server() {
    browserSync.init({
        server: {
            baseDir: 'src',
        },
    });

    gulp.watch(paths.html).on('change', browserSync.reload);
}

// Компиляция и обработка стилей
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Отслеживание изменений
function watchFiles() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html).on('change', browserSync.reload);
}

// Основная задача по умолчанию
const watch = gulp.parallel(watchFiles, server);

exports.styles = styles;
exports.watch = watch;
exports.default = watch;