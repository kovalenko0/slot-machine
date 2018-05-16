const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    './source/entry.jsx'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html'
    })
  ],
  devServer: {
    contentBase: './dist'
  }
}
