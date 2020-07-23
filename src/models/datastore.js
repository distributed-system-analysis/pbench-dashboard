import getDefaultDateRange from '../utils/moment_constants';
import { queryDatastoreConfig, queryMonthIndices } from '../services/datastore';

export default {
  namespace: 'datastore',

  state: {
    datastoreConfig: {},
    indices: [],
  },

  effects: {
    *fetchDatastoreConfig({ payload }, { call, put }) {
      const response = yield call(queryDatastoreConfig, payload);

      // Remove the trailing slashes if present, we'll take care of adding
      // them back in the proper context.
      response.elasticsearch = response.elasticsearch.replace(/\/+$/, '');
      response.results = response.results.replace(/\/+$/, '');

      yield put({
        type: 'getDatastoreConfig',
        payload: response,
      });
    },
    *fetchMonthIndices({ payload }, { call, put }) {
      const response = yield call(queryMonthIndices, payload);
      const { datastoreConfig } = payload;
      const indices = [];

      const prefix = datastoreConfig.prefix + datastoreConfig.run_index.slice(0, -1);
      Object.keys(response).forEach(index => {
        if (index.includes(prefix)) {
          indices.push(index.split('.').pop());
        }
      });

      indices.sort((a, b) => parseInt(b.replace('-', ''), 10) - parseInt(a.replace('-', ''), 10));

      yield put({
        type: 'getMonthIndices',
        payload: indices,
      });
      yield put({
        type: 'global/updateSelectedDateRange',
        payload: getDefaultDateRange(indices[0]),
      });
    },
  },

  reducers: {
    getDatastoreConfig(state, { payload }) {
      return {
        ...state,
        datastoreConfig: payload,
      };
    },
    getMonthIndices(state, { payload }) {
      return {
        ...state,
        indices: payload,
      };
    },
  },
};
