var gulp = require('gulp'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');
    gp_uglifycss = require('gulp-uglifycss');

gulp.task('js', function(){
    return gulp.src('dist/js/autoCompltr.js')
        .pipe(gp_rename('autoCompltr.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('css', function(){
    return gulp.src('dist/css/autoCompltr.css')
        .pipe(gp_rename('autoCompltr.min.css'))
        .pipe(gp_uglifycss())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('default', ['js', 'css'], function(){});