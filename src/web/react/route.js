import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import Html from '../../../src/client/components/html';
import { IntlProvider } from 'react-intl';
import prerender from '../react/prerender';
import MobileDetect from 'mobile-detect';
import fs from 'fs';

export default (asset, routes, configureStore) => {
  return async (ctx, next) => {
    if (ctx.body) {
      return next();
    }

    let store = configureStore(),
      messages = {},
      locale = 'en';

    // locale
    try {
      const locales = [ 'en', 'ko', 'id', 'th', 'my' ];
      locale = locales.includes(ctx.session.locale) ? ctx.session.locale : 'en';
      messages = JSON.parse(fs.readFileSync(`./resources/locale/${locale}.json`, 'utf8'));
    } catch (e) {
      throw new Error(e);
    }

    await new Promise((resolve, reject) => {
      match({routes: routes, location: ctx.req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
          ctx.status = 500;
          ctx.body = error.message;
          resolve();
        } else if (redirectLocation) {
          ctx.redirect(302, redirectLocation.pathname + redirectLocation.search);
          resolve();
        } else if (renderProps) {
          renderProps.components.shift(); // remove the root route. see /client/Routes.js
          if (ctx.session.authenticated === true) {
            let { id, username, name, avatar_url } = ctx.session.user;
            store.dispatch({ type: 'app/authenticated', user: { id, username, name, avatar_url } });
          }
          let md = new MobileDetect(ctx.headers['user-agent']);
          if (md.mobile() !== null) {
            store.dispatch({ type: 'app/mobile' });
          }
          prerender(
            store.dispatch,
            renderProps.components,
            renderProps.params,
            {
              query: renderProps.location.query,
              cookie: ctx.req.headers.cookie
            }
          ).then(() => {
            let component = (<IntlProvider locale={locale} messages={messages}><Provider store={store}><RouterContext {...renderProps}/></Provider></IntlProvider>);
            ctx.status = 200;
            ctx.type = 'text/html';
            ctx.body = '<!doctype html>\n' + ReactDOM.renderToString(<Html component={component} locale={locale} store={store} asset={asset} csrf={ctx.state.csrf} />);
            resolve();
          })
          .catch(e => {
            ctx.status = 404;
            reject(e);
          });
        } else {
          ctx.status = 404;
          resolve();
        }
      });
    });

    return next();
  };
};
