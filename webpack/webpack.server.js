require('dotenv').config();
var webpack = require("webpack");
var config = require("./webpack.config.js");
var wds = {
    hostname: "localhost",
    port: 8888
};

config.cache   = true;
config.debug   = true;
config.devtool = "cheap-module-eval-source-map";

for (let key of Object.keys(config.entry)) {
  config.entry[key].unshift(
    "webpack-dev-server/client?http://" + wds.hostname + ":" + wds.port,
    "webpack/hot/only-dev-server"
  )
}

config.devServer = {
  publicPath: "http://" + wds.hostname + ":" + wds.port + "/dist/",
  hot:        true,
  inline:     false,
  lazy:       false,
  quiet:      false,
  noInfo:     true,
  https:      false,
  headers:    {"Access-Control-Allow-Origin": "*"},
  stats:      {colors: true},
  host:       wds.hostname,
  port:       wds.port
};

config.output.publicPath             = config.devServer.publicPath;
config.output.hotUpdateMainFilename  = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.CommonsChunkPlugin('commons.js'),
  new webpack.NoErrorsPlugin(),
  new webpack.EnvironmentPlugin([ 'NODE_ENV', 'APP_HOST', 'ASSET_HOST', 'SCRIPT_HOST' ]),
];

config.module.postLoaders = [
    { test: /\.js$/, loaders: ['react-hot'], exclude: /node_modules/ }
];

module.exports = config;
