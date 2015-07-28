'use strict';

var project = require('./package.json'),
    path = require('path'),
    production = process.env.NODE_ENV === 'production';

var buildRoot = path.join(__dirname, 'dist', project.name);
var buildWebPath = path.join(buildRoot, 'web', project.name);
var config = {
  'scripts': {
    'src'  : './js/**/*(!spec).js',
    'dest': path.join(buildWebPath, 'js'),
    'entry': './app/js/index.js'
  },
  'styles': {
    'src' : 'app/styles/**/*.less',
    'dest': path.join(buildWebPath, 'styles')
  },
   'fonts': {
    'src' : [
      './bower_components/fontawesome/fonts/*',
      './app/fonts/**/*'
    ],
    'dest': path.join(buildWebPath, 'fonts')
  },
  'views': {
    'src': 'app/views/**/*.html',
    'dest': path.join(buildRoot, 'views')
  },
};

// Load plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    buffer = require('gulp-buffer'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    fs = require('fs'),
    stream = require('stream'),
    mustache = require('mustache'),
    gulpstache = require("gulp-mustache"),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),

    eslint = require('gulp-eslint'),

    karma = require('karma').server,
    notifier = require('node-notifier'),

    browserify = require('browserify'),
    babelify = require('babelify'),
    sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');

// Optimisers
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

var browserified = transform(function(filename) {
  var b = browserify({entries: filename, debug: true});
  return b.bundle();
});

function mustachifyWebParts(webParts, templatePath){
  var webParts = project.webParts || [],
      template = fs.readFileSync(templatePath, {encoding: 'utf8'}),
      src = stream.Readable({ objectMode: true });

  src._read = function () {
    mustache.parse(template); // speeds up mustache templating
    webParts.forEach(function(webPart) {
      var templatedOutput = mustache.render(template, {htmlFilePrefix: webPart.htmlFilePrefix});
      this.push(new gutil.File({ cwd: __dirname, base: path.join(__dirname, './webParts/'), path: path.join(__dirname, './webParts/', webPart.name + '.webpart.xml'), contents: new Buffer(templatedOutput) }))
      this.push(null)
    }, this)
  }
  return src
};


// Module definition XML for LabKey
gulp.task('labkey:module', function() {
  return gulp.src("./app/templates/module.xml.mustache")
    .pipe(gulpstache({
        name: project.name,
        // LabKey needs double values for the version, so can't cope with SemVer.
        // We'll take the major and minor numbers to make the LabKey version.
        version: project.version.split(".").slice(0,2).join('.')
    }))
    .pipe(rename('module.xml'))
    .pipe(gulp.dest(path.join(buildRoot, 'config')));
});

// Generates the XML definitions for each WebPart
gulp.task('labkey:webParts', function() {
  return mustachifyWebParts(project.webParts, "./app/templates/webpart.xml.mustache")
    .pipe(gulp.dest(config.views.dest));
});

gulp.task('views', ['labkey:webParts'], function() {
  return gulp.src(config.views.src)
    .pipe(replace('/'+project.name+'/', '<%=contextPath%>/'+project.name+'/'))
    .pipe(gulp.dest(config.views.dest));
});

// Styles
gulp.task('styles', function() {
  return gulp.src(config.styles.src)
    .pipe(less())
    .pipe(gulp.dest(config.styles.dest));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('scripts:test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    // 'osx' reporter hangs this test
    reporters: ['progress']
  }, done);
});

// Validate JavaScript
gulp.task('scripts:validate', function() {
  return gulp.src(config.scripts.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


// Build JavaScript with Browserify to index.js
gulp.task('scripts:compile', function() {
  return browserify(config.scripts.entry, {
        standalone: 'noscope',
        debug: true
      })
    .bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.scripts.dest))
});

gulp.task('useref', [
      'views',
      'styles',
      'scripts:compile'
    ], function() {

  var userefAssets = useref.assets({
    searchPath: 'dist/'+project.name+'/web'
  });

  var pipeline = gulp.src(config.views.src)
    .pipe(userefAssets)      // Concatenate with gulp-useref

    .pipe(gulpif('*.js', uglify({mangle: true})))
    .pipe(gulpif('*.css', minifyCss()))

    .pipe(rev())                // Rename the concatenated files
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace())         // Substitute in new filenames
    .pipe(replace('../web/', '<%=contextPath%>/'))
    .pipe(gulp.dest(config.views.dest));
});

// Clean
gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
});

gulp.task('build:develop', function() {
  gulp.start(
    'fonts',
    'labkey:module',
    'styles',
    'scripts:compile',
    'scripts:validate',
    'views'
  );
});

gulp.task('build:optimised', function() {
  gulp.start(
    'fonts',
    'labkey:module',
    'scripts:validate',
    'useref'
  );
});

// Default task
gulp.task('default', function (cb) {
  runSequence(
      'scripts:test',
      'build:optimised',
      cb
  );
});
