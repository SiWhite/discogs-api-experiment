require('es6-promise').polyfill();

var browserify   = require('browserify');
var gulp         = require('gulp');
var watch        = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var size         = require('gulp-size');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var nodemon      = require('gulp-nodemon');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var watchify     = require('watchify');
var assign       = require('lodash').assign;
var argv         = require('yargs').argv;
var collapse     = require('bundle-collapser/plugin');

var config = {
  autoprefixer: {
    cascade: false,
  },
  browserify: {
    name: 'bundle.js',
    dest: 'public',
    options: {
      debug: false,
      entries: 'js/main.js',
    },
    error: function(err) {
      gutil.log(gutil.colors.red('Browserify error:') + ' ' + err.message);
      this.emit('end');
    },
  },
  compress: ! argv.u,
  minifyCss: {
    keepBreaks: true,
    keepSpecialComments: false,
  },
  sass: {
    src: 'scss/**/*.scss',
    dest: 'public',
    options: {
      includePaths: [
        'scss',
        'bower_components/bootstrap-sass/assets/stylesheets/',
        'bower_components/fontawesome/scss/'
      ],
    },
    error: function(err) {
      gutil.log(gutil.colors.red('Sass error:') + ' ' + err.message);
      this.emit('end');
    },
  },
  size: {
    showFiles: true,
  },
  nodemon: {
    script: 'server.js',
    ignore: ['js/**/*.js', 'public/js/**/*.js']
  }
};

gulp.task('css', function() {
  return gulp.src(config.sass.src)
    .pipe(sass(config.sass.options).on('error', config.sass.error))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(config.compress ? minifyCss(config.minifyCss) : gutil.noop())
    .pipe(size(config.size))
    .pipe(gulp.dest(config.sass.dest));
});

gulp.task('js', function() {
  var bundler  = browserify(config.browserify.options);

  return bundler.plugin(collapse).bundle()
    .on('error', config.browserify.error)
    .pipe(source(config.browserify.name))
    .pipe(buffer())
    .pipe(config.compress ? uglify() : gutil.noop())
    .pipe(size(config.size))
    .pipe(gulp.dest(config.browserify.dest));
});

gulp.task('watch', ['css'], function() {
  var options = assign({}, watchify.args, config.browserify.options);
  var bundler = watchify(browserify(options));

  bundler.on('update', build);

  function build() {
    return bundler.plugin(collapse).bundle()
      .on('error', config.browserify.error)
      .pipe(source(config.browserify.name))
      .pipe(buffer())
      .pipe(config.compress ? uglify() : gutil.noop())
      .pipe(size(config.size))
      .pipe(gulp.dest(config.browserify.dest));
  }

  watch(config.sass.src, function() {
		gulp.start('css');
	});

  return build();
});

gulp.task('server',function(){
  nodemon(config.nodemon);
});

gulp.task('default', ['server','css', 'js']);
