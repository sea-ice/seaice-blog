const path = require('path')

module.exports = {
  target: 'node',
  // 每个entry可以都配置成数组，表示在该入口文件生成的chunk注入依赖文件（比如下面的生成的chunk会注入babel-polyfill）
  entry: {
    server: [
      'babel-polyfill',
      path.resolve(__dirname, '../server/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, '../build/server'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.node$/,
      use: 'node-loader'
    }]
  }
}
