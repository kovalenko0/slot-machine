const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: [
    './source/entry.jsx'
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: ['awesome-typescript-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './source/index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: './source/media',
        to: 'media'
      }
    ])
  ],
  devServer: {
    contentBase: './dist'
  }
}
