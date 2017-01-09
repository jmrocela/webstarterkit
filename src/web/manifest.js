import ReactRoute from './react/route';

import { routes as discoverRoutes, configureStore as discoverStore } from '../../src/apps/discover/routes';

export default function(router) {

  // React Mounts
  const DiscoverRenderer = ReactRoute('discover', discoverRoutes, discoverStore);
  router.get('/', DiscoverRenderer);
  router.get('*', DiscoverRenderer);

}
