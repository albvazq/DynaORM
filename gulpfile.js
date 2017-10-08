var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var cleanDest = require('gulp-clean-dest');

gulp.task("build", function() {
    return gulp.src("src/**/*.js")
        .pipe(cleanDest('build'))
        .pipe(babel({
            "presets": ["es2015", "stage-3"]
        }))
        .pipe(gulp.dest("build"));
});