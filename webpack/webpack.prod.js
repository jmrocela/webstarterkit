require('dotenv').config();
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');
var path = require("path");
var fs = require('fs');
var query = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));

module.exports = {
  target: "node",
  cache: false,
  context: __dirname,
  debug: false,
  info: true,
  devtool: process.env.NODE_ENV === 'production' ? "cheap-module-source-map": "#eval-cheap-module-source-map",
  entry: {
    webclient: [ 'babel-polyfill', '../webclient.js' ]
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: `[name].js`
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, output: { comments: false } })
  ],
  resolve: {
    extensions: [
      "",
      ".js",
      ".json",
    ]
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', query: query, exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json', exclude: /node_modules/ }
    ],
    noParse: /\.min\.js/
  },
  externals: [ nodeExternals() ],
};
