import redis from 'redis';
import Promise from 'bluebird';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export default redis.createClient({
  host: process.env.CACHE_HOST || '127.0.0.1',
  port: process.env.CACHE_PORT || '6379'
});
