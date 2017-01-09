/**
 * Logger
 *
 * Exposes a number of logging methods that are used throughout
 * the system.
 *
 * @author John Rocela <jamoy@hooq.tv>
 */
import winston from 'winston';
import newrelic from 'newrelic';
import 'winston-elasticsearch';

if (process.env.NODE_ENV === 'production') {
  winston.remove(winston.transports.Console);
}

winston.add(winston.transports.Elasticsearch, {
  clientOpts: {
    host: {
      host: process.env.ELASTICSEARCH_HOST,
      port: process.env.ELASTICSEARCH_PORT
    }
  }
});

export default {
  log: winston.log,
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  record: (tag: string) => {
    return newrelic.recordMetric(`custom/${tag.toLowerCase()}`);
  },
  event: (tag: string, payload: object) => {
    return newrelic.recordCustomMetric(tag, payload);
  }
};
