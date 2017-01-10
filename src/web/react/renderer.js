import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import fs from 'fs';
import prerender from '../React/Prerender';
import MobileDetect from 'mobile-detect';
import { configureStore } from '../../../src/apps/discover/routes';

export default async (component, ctx) => {
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

  if (ctx.session.authenticated === true) {
    let { id, username, name, avatar_url } = ctx.session.user;
    store.dispatch({ type: 'app/authenticated', user: { id, username, name, avatar_url } });
  }
  let md = new MobileDetect(ctx.headers['user-agent']);
  if (md.mobile() !== null) {
    store.dispatch({ type: 'app/mobile' });
  }

  return prerender(
    store.dispatch,
    [],
    {},
    {
      query: {},
      cookie: ctx.req.headers.cookie
    }
  ).then(() => {
    return ReactDOM.renderToStaticMarkup(<IntlProvider locale={locale} messages={messages}><Provider store={store}>{component}</Provider></IntlProvider>);
  });
};
