import getDefaultDateRange from '../utils/moment_constants';
import queryMonthIndices from '../services/datastore';

export default {
  namespace: 'datastore',

  state: {
    indices: [],
  },

  effects: {
    *fetchMonthIndices({ payload }, { call, put }) {
      const { response, data } = yield call(queryMonthIndices, payload);

      if (response.ok) {
        yield put({
          type: 'getMonthIndices',
          payload: data,
        });
        yield put({
          type: 'global/updateSelectedDateRange',
          payload: getDefaultDateRange(data[0]),
        });
      }
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
