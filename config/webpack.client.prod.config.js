let path = require('path')
// let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')
// let CopyWebpackPlugin = require('copy-webpack-plugin')
let HTMLWebpackPlugin = require('html-webpack-plugin')
// let ParallelUglifyJSPlugin = require('webpack-parallel-uglify-plugin')
let UglifyJSPlugin = require('uglifyjs-webpack-plugin')
let ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')

const client_build_dir = path.resolve(__dirname, '../build/client')

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
    path: client_build_dir,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    mainFields: ['jsnext:main', 'browser', 'main']
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'base',
      filename: 'base.js'
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../static/index.html'),
      filename: path.resolve(client_build_dir, 'index.html'),
      chunks: ['base', 'blog'],
      minify: true
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../static/admin/index.html'),
      filename: path.resolve(client_build_dir, 'admin/index.html'),
      chunks: ['base', 'admin'],
      minify: true
    }),
    new UglifyJSPlugin({
      test: /\.js$/,
      // exclude: /node_modules/,
      uglifyOptions: {
        output: {
          beautify: false,
          comments: false
        },
        compress: {
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        }
      }
    }),
    new ModuleConcatenationPlugin()
  ]
}
