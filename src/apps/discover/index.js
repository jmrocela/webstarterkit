import React from 'react';
import ReactDOM from 'react-dom';
import match from 'react-router/lib/match';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';

import { configureStore, routes } from './routes';

let devtool;
if (process.env.NODE_ENV !== 'production') {
  devtool = window.devToolsExtension && window.devToolsExtension();
}

const store = configureStore(window.__data, devtool);

const reactRoot = window.document.getElementById('react-root');
match({ history: browserHistory, routes: routes }, (error, redirectLocation, renderProps) => {
  addLocaleData({ locale: window.__locale, pluralRuleFunction: () => {} });
  ReactDOM.render(<IntlProvider locale="en" messages={window.__localeMessages || {}}><Provider store={store}><Router {...renderProps} /></Provider></IntlProvider>, reactRoot);
});

if (process.env.NODE_ENV !== 'production') {
  if (!reactRoot.firstChild || !reactRoot.firstChild.attributes ||
    !reactRoot.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
