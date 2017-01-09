/**
 * This file serves as an entry point for bundling via webpack.
 *
 * For development, this is a passthrough to the main gateway script. The server
 * assumes that the config is already in `process.env`.
 *
 * @author John Rocela <jamoy@hooq.tv>
 */
require('dotenv').config();

// Development settings
if (process.env.NODE_ENV !== 'production') {
  require('babel-register')();
  require('babel-polyfill');
}

// Include Newrelic
process.env.NODE_ENV === 'production' && require('newrelic');

// Override the global promise with the bluebird implementation
global.Promise = require('bluebird');

// Start the party
require('./lib/webclient');
