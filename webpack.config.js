/**
 * @Author: Fabre Ed
 * @Date:   2017-12-01T18:25:39-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: webpack.config.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-02T14:14:18-05:00
 */



const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  }
};
