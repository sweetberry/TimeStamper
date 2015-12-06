const gulp = require( 'gulp' );
const edit = require( 'gulp-edit' );
//const electron = require( 'gulp-atom-electron' );
const electronPrebuilt = require( 'electron-prebuilt' );
const childProcess = require( 'child_process' );
const rimraf = require( 'rimraf' );
const runSequence = require( 'run-sequence' );
const webpack = require( 'webpack-stream' );
const electron = require( 'gulp-atom-electron' );
const symdest = require( 'gulp-symdest' );
const zip = require('gulp-vinyl-zip');

const packageJson = require( './package.json' );
const destinationDirPath = './dist/';
const webpackConfig = require( './webpack.config.js' );
var debug = false;

gulp.task( 'debug', function () {
  debug = true;
  runSequence( 'clean-dest', ['_copy-otherFiles', '_webpack-build'], function () {
    childProcess.spawn( electronPrebuilt, ['./dist/src'] );
  } )
} );

gulp.task( 'clean-dest', function ( callback ) {
  rimraf( destinationDirPath, callback );
} );

gulp.task( '_copy-otherFiles', function () {
  return gulp.src(
      ['src/package.json', 'src/js/main/**/*.js', 'src/html/**/*.html', 'src/css/**', 'src/fonts/**'],
      {base: './'} )
      .pipe( gulp.dest( destinationDirPath ) );
} );

gulp.task( '_webpack-build', function () {
  if (debug) {
    webpackConfig.devtool = '#source-map';
  }

  return gulp.src( './' )
      .pipe( webpack( webpackConfig ) )
      .pipe( gulp.dest( destinationDirPath + '/src/js/renderer' ) );
} );

gulp.task( 'build-osx', function () {
  runSequence( 'clean-dest', ['_copy-otherFiles', '_webpack-build'], function () {
    return gulp.src( './dist/src/**' )
        .pipe( electron( {
          version   : '0.35.2',
          platform: 'darwin',
          darwinIcon: './resource/icons/TimeStamper.icns'
        } ) )
        .pipe( symdest( './dist/bin/osx' ) );
  } )

} );

gulp.task( 'build-win32', function () {
  return gulp.src( './dist/src/**' )
      .pipe( electron( {
        version: '0.35.2',
        platform: 'win32',
        arch: 'ia32',
        winIcon: './resource/icons/TimeStamper.ico',
        companyName: 'SweetberryStudio',
        copyright: '(C) 2015 SweetberryStudio'
      } ) )
      .pipe( zip.dest( 'dist/bin/win32/' + packageJson.name + '_win32.zip' ) );
} );

