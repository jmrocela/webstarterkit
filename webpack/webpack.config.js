require('dotenv').config();
var webpack = require("webpack");
var path = require("path");

module.exports = {
  target: "web",
  cache: false,
  context: __dirname,
  debug: false,
  devtool: process.env.NODE_ENV === 'production' ? "cheap-module-source-map": "#eval-cheap-module-source-map",
  entry: {
    "discover": ["../src/apps/discover"]
  },
  output: {
    path: path.join(__dirname, "../resources/public/dist"),
    filename: `[name].js`,
    chunkFilename: "[name].[id].js"
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('commons.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.EnvironmentPlugin([ 'NODE_ENV', 'APP_HOST', 'ASSET_HOST', 'SCRIPT_HOST' ]),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, output: { comments: false } })
  ],
  externals: process.env.NODE_ENV === 'production' ? { "react": "React", "react-dom": "ReactDOM" } : {},
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', exclude: /node_modules/}
    ],
    noParse: /\.min\.js/
  }
};
