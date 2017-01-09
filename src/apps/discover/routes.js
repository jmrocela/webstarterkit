import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { canusedom } from '../../client/helpers/domutil';
import thunk from 'redux-thunk';

import Wrapper from '../../client/components/wrapper';
import HomeContainer from './containers/home_container';
import NotFoundContainer from './containers/notfound_container';

import AppReducer from '../../client/redux/app';

export const configureStore = (initial = {}) => {
  const store = createStore(
    combineReducers({
      routing: routerReducer,
      app: AppReducer
    }),
    initial,
    compose(
      applyMiddleware(thunk, routerMiddleware(browserHistory)),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )
  );

  if (module.hot) {
    module.hot.accept();
  }

  return store;
};

if (canusedom) {
  browserHistory.listenBefore(location => {
    // record url change
  });
}

export const routes = (
  <Router history={browserHistory}>
    <Route path='/' component={Wrapper}>
      <IndexRoute component={HomeContainer} />
    </Route>
    <Route path='*' component={NotFoundContainer} />
  </Router>
);

export default routes;
