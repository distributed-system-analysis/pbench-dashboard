import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { version } from '../package.json';
import { getAppPath } from './utils/utils';

/*
 * redux persist configuration for saving state object to persisted storage.
 *
 * `dashboard` and `search` are blacklisted from the saved state as the namespaces
 * persist data that is constantly updated on the server side.
 */

const persistConfig = {
  throttle: 1000,
  key: getAppPath(),
  storage,
  whitelist: ['global', 'user'],
};

const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const cachedVersionId = window.localStorage.getItem('versionId');
  if (cachedVersionId && cachedVersionId !== version && process.env.NODE_ENV === 'production') {
    window.localStorage.clear();
  }
  window.localStorage.setItem('versionId', version);

  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store, null);

  return {
    persist,
    ...store,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const dva = {
  config: {
    extraEnhancers: [persistEnhancer()],
  },
};
