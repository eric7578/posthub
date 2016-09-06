const webpack = require('webpack');

module.exports = {
  entry: {
    app: './components/index.js'
  },
  output: {
    filename: './public/javascripts/[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};
