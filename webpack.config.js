const webpack = require('webpack');

module.exports = {
  entry: {
    index: './views/index/index.js',
    vendor: [
      'react',
      'redux',
      'react-redux',
      'redux-saga',
      'react-css-modules',
      'whatwg-fetch',
      'es6-promise'
    ]
  },
  output: {
    filename: './public/javascripts/[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('Owned and loved by ProjectEngine'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: './public/javascripts/vendor.js'
    })
  ]
};
