"use strict";

const path = require( 'path' );
const fs = require( 'fs' );
const child_process = require( 'child_process' );
const fse = require( 'fs-extra' );
const moment = require( 'moment' );
const Backbone = require( 'backbone' );
Backbone.LocalStorage = require( "backbone.localstorage" );

//noinspection JSAccessibilityCheck
const ConfigModel = Backbone.Model.extend( {
  localStorage: new Backbone.LocalStorage( "timeStamperConfig" ),
  defaults    : {
    action         : 'rename',
    readOnly       : true,
    usePrefix      : false,
    useSuffix      : false,
    useTimestamp   : true,
    prefixString   : '',
    recentPrefix   : [],
    suffixString   : '',
    recentSuffix   : [],
    timeSrc        : 'today',
    timestampFormat: '_YYMMDD'
  },

  executeStamp      : function ( srcFilePath ) {
    const ext = path.extname( srcFilePath );
    const basename = path.basename( srcFilePath, ext );
    const dirname = path.dirname( srcFilePath );

    //updateRecent
    if (this.get( 'usePrefix' )) {
      this.updateRecentPrefix();
    }
    if (this.get( 'useSuffix' )) {
      this.updateRecentSuffix();
    }

    // resultFilePathを決める
    var resultBasename = '';
    if (this.get( 'usePrefix' )) {
      resultBasename += this.get( 'prefixString' );
    }
    resultBasename += basename;
    if (this.get( 'useSuffix' )) {
      resultBasename += this.get( 'suffixString' );
    }
    if (this.get( 'useTimestamp' )) {
      var time;
      if (this.get( 'timeSrc' ) == 'lastModified') {
        time = fs.statSync( srcFilePath ).mtime;
      } else {
        time = Date.now();
      }
      resultBasename += moment( time ).format( this.get( 'timestampFormat' ) );
    }

    const resultFilePath = ensureUniqueName( path.join( dirname, resultBasename + ext ) );
    //console.log( resultFilePath );

    const isReadOnly = this.get( 'readOnly' );

    // copy
    if (this.get( 'action' ) == 'copy') {
      fse.copy( srcFilePath, resultFilePath, {preserveTimestamps: true}, function ( err ) {
        if (err) {console.error( err )}
        applyReadOnly();
      } );
    }

    // rename
    if (this.get( 'action' ) == 'rename') {
      fs.rename( srcFilePath, resultFilePath, function ( err ) {
        if (err) {console.error( err )}
        applyReadOnly();
      } );
    }

    // readOnly
    function applyReadOnly () {
      if (isReadOnly) {
        const isWindows = process.platform.indexOf( "win" ) === 0;
        if (isWindows) {
          try {
            //build済みelectronのwin版でerrorが出ます。咬み殺すのもやなのでログだけは残す。
            child_process.execSync( 'attrib +r "' + resultFilePath + '"' );
          } catch (e) {
            console.error( e );
          }
        } else {
          child_process.execSync( 'chflags uchg ' + resultFilePath.replace( /(\s)/g, '\\ ' ) );
        }
      }
    }

  },
  updateRecentPrefix: function () {
    const prefix = this.get( 'prefixString' );
    const recentPrefix = this.get( 'recentPrefix' );
    this.save( 'recentPrefix', updateRecentListArray( recentPrefix, prefix ) );
  },
  updateRecentSuffix: function () {
    const suffix = this.get( 'suffixString' );
    const recentSuffix = this.get( 'recentSuffix' );
    this.save( 'recentSuffix', updateRecentListArray( recentSuffix, suffix ) );
  }

} );

const configModel = module.exports = new ConfigModel( {id: 0} );
configModel.fetch();
configModel.save();

function ensureUniqueName ( filePath ) {
  const dirname = path.dirname( filePath );
  const fileNameList = fs.readdirSync( dirname );
  const timestampSuffixDict = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z'];

  function isUnique ( name ) {
    return !fileNameList.length || fileNameList.indexOf( name ) < 0;
  }

  var destName = path.basename( filePath );

  if (!isUnique( destName )) {
    var inc = 0;
    do {
      const mod = inc % 22;
      var timestampSuffix = timestampSuffixDict[mod];
      if (inc - mod) {timestampSuffix += (inc - mod)}
      var tempName = path.basename( destName, path.extname( destName ) ) + timestampSuffix + path.extname( destName );
      inc++;
    } while (!isUnique( tempName ));
    destName = tempName;
  }

  return path.join( dirname, destName );
}

function updateRecentListArray ( listArray, value, count ) {
  const _count = count || 5;
  var res = _.without( listArray, value );
  res.unshift( value );
  return res.slice( 0, _count );
}

