import fetch from 'isomorphic-fetch';
import { canusedom } from './domutil';
import NProgress from 'nprogress';
import moment from 'moment';

if (canusedom) {
  NProgress.configure({ showSpinner: false });
}

let hashCode = (string) => {
  let hash = 0;
  if (string.length == 0) return hash;
  for (let i = 0; i < string.length; i++) {
    let char = string.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash;
  }
  return hash;
};

// @TODO queue requests
export default (url, options = {}) => {
  options.headers = {};

  if (canusedom) {
    NProgress.start();
    options.headers['x-csrf-token'] = window.__csrf;
  }

  options.credentials = 'include';
  if (options.type === 'json') {
    options.headers['content-type'] = 'application/json';
    options.headers['accept-encoding'] = 'gzip';
    options.body = JSON.stringify(options.body);
  }

  if (options.cookie) {
    options.headers['cookie'] = options.cookie;
  }

  options.method = options.method || 'GET';

  // cached
  const cacheEnabled = options.method.toLowerCase() === 'GET' && options.cache !== false && canusedom && window.localStorage && process.env.NODE_ENV === 'production';
  const scheme = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
  if (cacheEnabled) {
    let key = hashCode(`${scheme}${process.env.APP_HOST}${url}:${JSON.stringify(options.body)}`);
    const cached = window.localStorage.getItem(key);
    if (cached) {
      const { data, expiry } = JSON.parse(cached);
      if (moment(expiry).isBefore()) {
        NProgress.done();
        return new Promise(function(resolve) {
          resolve(data);
        });
      }
    }
  }

  return fetch(`${scheme}${process.env.APP_HOST}${url}`, options)
    .then((response) => {
      try {
        if (canusedom) {
          NProgress.done();
        }

        if (response.status > 300) {
          throw new Error(response.json(), response.status);
        }

        if (response.status === 204) {
          return null;
        }

        let data = response.json();
        if (cacheEnabled) {
          data.then(response => {
            let expiry = 900;
            window.localStorage.setItem(key, JSON.stringify({ expiry, data: response }));
          });
        }
        return data;
      } catch (e) {
        throw e;
      }
    });
};