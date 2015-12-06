"use strict";
function suppressPageChangeOnDrop () {

  /** documentにドラッグされた場合 / ドロップされた場合 */
  document.ondragover = document.ondrop = function ( e ) {
    
    // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする
    e.preventDefault();
    return false;
  };
}
module.exports = suppressPageChangeOnDrop;
