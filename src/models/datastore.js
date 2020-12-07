import getDefaultDateRange from '../utils/moment_constants';
import queryMonthIndices from '../services/datastore';

export default {
  namespace: 'datastore',

  state: {
    indices: [],
  },

  effects: {
    *fetchMonthIndices({ payload }, { call, put }) {
      const response = yield call(queryMonthIndices, payload);
      const { endpoints } = window;
      const indices = [];

      const prefix = endpoints.prefix + endpoints.run_index.slice(0, -1);
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
    getMonthIndices(state, { payload }) {
      return {
        ...state,
        indices: payload,
      };
    },
  },
};
