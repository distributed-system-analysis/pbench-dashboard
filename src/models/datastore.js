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

      yield put({
        type: 'getMonthIndices',
        payload: response,
      });
      yield put({
        type: 'global/updateSelectedDateRange',
        payload: getDefaultDateRange(response[0]),
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
