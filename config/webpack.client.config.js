let path = require('path')
// let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')
// let CopyWebpackPlugin = require('copy-webpack-plugin')
let HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    'base': [
      'react',
      'react-dom'
    ],
    'blog': [
      path.resolve(__dirname, '../client/blog/index.js')
    ],
    'admin': [
      'babel-polyfill',
      path.resolve(__dirname, '../client/admin/index.js')
    ]
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build/client'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: ['css-loader', 'sass-loader'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: 'css-loader',
      exclude: /node_modules/
    }, {
      test: /\.(woff|ttf|jpg|png|svg|jpeg)/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }]
    }]
  },
  devServer: {
    open: true,
    inline: true,
    hot: true,
    port: 9000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'base',
      filename: 'base.js'
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../static/index.html'),
      chunks: ['base', 'blog'],
      minify: true
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../static/admin/index.html'),
      filename: 'admin/index.html', // devServer不需要指定contentBase，在内存中生成的html文件直接通过url即可访问到，比如当前插件生成的html在浏览器中直接通过/admin/index.html访问即可
      chunks: ['base', 'admin'],
      minify: true
    })
  ]
}
