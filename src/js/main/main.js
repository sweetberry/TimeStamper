const path = require( 'path' );
const BrowserWindow = require( 'browser-window' );  // Module to create native browser window.

// Report crashes to our server.
require( 'crash-reporter' ).start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
const app = require( 'app' );  // Module to control application life.
const dialog = require( 'dialog' );
const ipc = require( "electron" ).ipcMain;

// エラー表示後終了
ipc.on( 'error-message', function ( event, arg ) {
  dialog.showErrorBox( "Error", arg );
  event.returnValue = true;
} );

// Quit when all windows are closed.
app.on( 'window-all-closed', function () {
  app.quit();
} );

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on( 'ready', function () {
  const isWindows = process.platform.indexOf( "win" ) === 0;

  // Create the browser window.
  mainWindow = new BrowserWindow( {
    width : 256,
    height: (isWindows) ? 512 : 384
  } );

  // and load the timeStamper.html of the app.
  mainWindow.loadURL( 'file://' + path.resolve( __dirname, '../../html/timeStamper.html' ) );

  // Emitted when the window is closed.
  mainWindow.on( 'closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  } );

} );
