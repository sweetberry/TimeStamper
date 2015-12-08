"use strict";

require( './menu' );

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
const suppressPageChangeOnDrop = require( '../common/suppressPageChangeOnDrop' );
const configModel = require( '../models/configModel' );
require( 'backbone.marionette' );
require( 'bootstrap' );

//noinspection JSUnusedGlobalSymbols
const TimeStamperView = Backbone.Marionette.LayoutView.extend( {
  model      : configModel,
  template   : '#main-view-template',
  el         : 'body',
  ui         : {
    'body'           : '.js-body-wrap',
    'renameBtn'      : '.js-rename-btn',
    'copyBtn'        : '.js-copy-btn',
    'readOnlyBtn'    : '.js-read-only-btn',
    'todayBtn'       : '.js-today-btn',
    'lastModifiedBtn': '.js-lastModified-btn',
    'prefixBtn'      : '.js-prefix-btn',
    'prefixInput'    : '.js-prefix-input',
    'suffixBtn'      : '.js-suffix-btn',
    'suffixInput'    : '.js-suffix-input',
    'timestampBtn'   : '.js-timestamp-btn',
    'timestampInput' : '.js-timestamp-input',
    'recentPrefixRow': '.js-prefix-recent-row',
    'recentSuffixRow': '.js-suffix-recent-row'

  },
  events     : {
    'click @ui.renameBtn'      : 'onClickRenameBtn',
    'click @ui.copyBtn'        : 'onClickCopyBtn',
    'click @ui.readOnlyBtn'    : 'onClickReadOnlyBtn',
    'click @ui.todayBtn'       : 'onClickTodayBtn',
    'click @ui.lastModifiedBtn': 'onClickLastModifiedBtn',
    'click @ui.prefixBtn'      : 'onClickPrefixBtn',
    'click @ui.suffixBtn'      : 'onClickSuffixBtn',
    'click @ui.timestampBtn'   : 'onClickTimestampBtn',
    'change @ui.prefixInput'   : 'onChangePrefixInput',
    'change @ui.suffixInput'   : 'onChangeSuffixInput',
    'change @ui.timestampInput': 'onChangeTimestampInput',
    'click @ui.recentPrefixRow': 'onClickRecentPrefixRow',
    'click @ui.recentSuffixRow': 'onClickRecentSuffixRow',
    'drop @ui.body'            : 'onDropBody'
  },
  modelEvents: {
    'change:action'         : 'render',
    'change:readOnly'       : 'render',
    'change:timeSrc'        : 'render',
    'change:usePrefix'      : 'render',
    'change:useSuffix'      : 'render',
    'change:useTimestamp'   : 'render',
    'change:prefixString'   : 'render',
    'change:suffixString'   : 'render',
    'change:timestampFormat': 'render'
  },

  onRender              : function () {
    suppressPageChangeOnDrop();
    //console.dir( this.model.toJSON() )
  },
  onClickRenameBtn      : function () {
    this.model.save( 'action', 'rename' );
  },
  onClickCopyBtn        : function () {
    this.model.save( 'action', 'copy' );
  },
  onClickReadOnlyBtn    : function () {
    this.model.save( 'readOnly', !this.model.get( 'readOnly' ) );
  },
  onClickTodayBtn       : function () {
    this.model.save( 'timeSrc', 'today' );
  },
  onClickLastModifiedBtn: function () {
    this.model.save( 'timeSrc', 'lastModified' );
  },
  onClickPrefixBtn      : function () {
    this.model.save( 'usePrefix', !this.model.get( 'usePrefix' ) );
  },
  onClickSuffixBtn      : function () {
    this.model.save( 'useSuffix', !this.model.get( 'useSuffix' ) );
  },
  onClickTimestampBtn   : function () {
    this.model.save( 'useTimestamp', !this.model.get( 'useTimestamp' ) );
  },
  onChangePrefixInput   : function ( e ) {
    this.model.save( 'prefixString', e.target.value );
  },
  onChangeSuffixInput   : function ( e ) {
    this.model.save( 'suffixString', e.target.value );
  },
  onChangeTimestampInput: function ( e ) {
    this.model.save( 'timestampFormat', e.target.value );
  },
  onClickRecentPrefixRow: function ( e ) {
    this.model.save( 'prefixString', e.target.dataset.val );
  },
  onClickRecentSuffixRow: function ( e ) {
    this.model.save( 'suffixString', e.target.dataset.val );
  },
  onDropBody            : function ( e ) {
    const model = this.model;

    //noinspection JSUnresolvedVariable
    const droppedFilePathArray = _.map( e.originalEvent.dataTransfer.files, function ( file ) {return file.path} );
    //console.log( droppedFilePathArray );
    _.each( droppedFilePathArray, function ( filePath ) {
      model.executeStamp( filePath );
    } )
  }
} );

new TimeStamperView( {} ).render();

module.exports = TimeStamperView;
