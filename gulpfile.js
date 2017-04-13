var gulp = require('gulp')
var babel = require('babel-register')

let $ = require('gulp-load-plugins')()
let path = require('path')

const plugins = {
  babel: $.babel,
  mocha: $.mocha,
  sourcemaps: $.sourcemaps,
  eslint: $.eslint,
}


const paths = {
  src: ['src/**/*.js'],
  dist: 'dist',
  // Must be absolute or relative to source map
  sourceRoot: path.join(__dirname, 'dist'),
}

gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], {read: false}).pipe($.clean());
});

gulp.task('test', function () {
  return gulp.src(['test/*.js'])
  .pipe(plugins.mocha({
    compilers: plugins.babel
  }));
});

gulp.task('dev', function () {
  return gulp.src(paths.src)
  .pipe(plugins.babel())
  .pipe(gulp.dest(paths.dist));
})

gulp.task('build', function () {
  return gulp.src(paths.src)
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel())
  .pipe(plugins.sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
  .pipe(gulp.dest(paths.dist));
})

gulp.task('tdd', function () {
  return gulp.watch('test/*.js', ['test']);
})

gulp.task('watch', function () { // (D)
  gulp.start('clean')
  gulp.watch(paths.src, ['dev']);
});

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['src/**/*.js', '!node_modules/**'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
  .pipe(plugins.eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(plugins.eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
  .pipe(plugins.eslint.failAfterError());
});


gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// gulp.task('tdd-single', function () {
//   return gulp.watch('test/*.js')
//   .on('change', function (file) {
//     gulp.src(file.path)
//     .pipe(mocha({
//       compilers: plugins.babel
//     }))
//   });
// });