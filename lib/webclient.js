const _startupTime = process.hrtime();

import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import helmet from 'koa-helmet';
import views from 'koa-views';
import serve from 'koa-static';
import compress from 'koa-compress';
import Csrf from 'koa-csrf';
import co from 'co';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import bodyParser from 'koa-bodyparser';
import dust from 'dustjs-linkedin';
import uuid from 'uuid';
import 'dustjs-helpers';
import logger from './logger';
import { formatHrtime } from './utils';
import HttpError from './errors/http';
import jsonResponder from './response/json';
import routes from '../src/web/manifest';

// Instantiate the HTTP server for the webclient
const app = new Koa();
const router = new Router();

// Session
app.keys = [ process.env.SESSION_SECRET ];
app.use(convert(session({
  store: redisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }),
  key: process.env.SESSION_NAME,
  prefix: process.env.SESSION_PREFIX,
  ttl: process.env.SESSION_TTL,
  cookie: {
    maxage: process.env.SESSION_TTL
  }
})));

// Static assets; used for sw.js publishing for production
process.env.NODE_ENV !== 'production' && app.use(serve('./resources/public'));

// Parser
app.use(helmet());
app.use(bodyParser());
app.use(new Csrf());

// View Renderer
dust.config.whitespace = process.env.NODE_ENV !== 'production';
app.use(views('./server/Views', {
  cache: process.env.NODE_ENV === 'production',
  map: {
    html: 'dust'
  }
}));

// Are you ready?
app.use(async (ctx, next) => {
  const _requestStartTime = process.hrtime();
  ctx.request.id = uuid.v4();

  const { url, method, headers } = ctx.req;
  try {
    // Provide a helper for creating JSON responses through the use of `ctx.json`
    ctx.json = jsonResponder(ctx);

    // Wrap the render method with co
    ctx.render = co.wrap(ctx.render);

    // We run the routes downstream
    await next();

    // I see we did not find a route
    if (ctx.body === undefined && ctx.status === 404) {
      throw new HttpError('Resource does not exist', 404);
    }

    // Sets the default headers for the API calls
    ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    ctx.set('Expires', '0');
    ctx.set('Pragma', 'no-cache');
    ctx.set('Request-Id', ctx.request.id);

    // We do some logging
    logger.info('REQUEST', { ms: formatHrtime(_requestStartTime), url, method, headers, id: ctx.request.id });
    logger.record('request/request_made');
  } catch (err) {
    // We catch rejections and throw them to the client. Rejections
    // downstream will be handled in this block as well.
    logger.error('REQUEST', { ms: formatHrtime(_requestStartTime), error: err.message, trace: err.stack, url, method, headers, id: ctx.request.id });
    logger.record('request/exceptions_thrown');

    let errorStatus = 500;
    let errorPayload = {
      message: err.message
    };

    if (err.name === 'HttpError') {
      errorStatus = err.code;
      errorPayload.code = err.internal;
    }

    if (process.env.NODE_ENV !== 'production') {
      errorPayload.stack = err.stack;
    }

    ctx.json({ error: errorPayload }, errorStatus);
  }
});

// Use the routes provided by the HTTP Router and do some GZIP
// support for any outgoing requests.
routes(router);
app.use(router.routes());
app.use(router.allowedMethods({
  throw: true,
  methodNotAllowed: () => new HttpError('Method not allowed', 405),
  notImplemented: () => new HttpError('Not Implemented', 503)
}));

if (process.env.NODE_ENV === 'production') {
  app.use(compress({
    threshold: 128,
    flush: require('zlib').Z_SYNC_FLUSH
  }));
}

// We start the HTTP servers
const server = http.createServer(app.callback());
const port = process.env.PORT || 6258;
server.listen(port, (err) => {
  if (err) return logger.error(`webclient could not start due to error: ${err}`, err);
  return logger.info('STARTUP', `webclient started at port ${port}.`, { ms: formatHrtime(_startupTime) });
});
