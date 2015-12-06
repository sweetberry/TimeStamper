const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
  cache  : true,
  entry  : {
    timeStamper: './src/js/renderer/timeStamper.js'
  },
  target : 'atom',
  resolve: {
    modulesDirectories: ["node_modules"]
  },
  output : {
    filename     : '[name].js',
    chunkFilename: '[chunkhash].js'
    //sourceMapFilename : "[file].map"
  },
  module : {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.html$/, loader: 'html-loader'},
      // Required for bootstrap fonts
      {
        test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
      },
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?prefix=font/'}
    ]
  },
  plugins: [
    new webpack.ExternalsPlugin( 'commonjs', ['electron'] ),
    new webpack.ProvidePlugin( {
      // Automatically inject jQuery
      // This is required by many jQuery plugins
      jQuery  : "jquery",
      $       : "jquery",
      _       : "underscore",
      Backbone: 'backbone'
    } ),
    new webpack.optimize.UglifyJsPlugin( {
      sourceMap: true,
      mangle   : {
        except: ['$super', '$', 'exports', 'require']
      }
    } )
  ]
};
