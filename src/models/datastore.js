import moment from 'moment';
import getDefaultDateRange from '../utils/moment_constants';
import queryMonthIndices from '../services/datastore';

export default {
  namespace: 'datastore',

  state: {
    indices: [],
  },

  effects: {
    *fetchMonthIndices({ payload }, { call, put, all }) {
      try {
        const response = yield call(queryMonthIndices, payload);

        yield all([
          yield put({
            type: 'getMonthIndices',
            payload: response,
          }),
          yield put({
            type: 'global/updateSelectedDateRange',
            payload: getDefaultDateRange(response[0]),
          }),
        ]);
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield all(
          yield put({
            type: 'error/updateAlertMessage',
            payload: {
              messageType: 'error',
              message: errortext,
            },
          }),
          // when there is an error while fetching
          // month indices we default to last one week.
          yield put({
            type: 'error/updateSelectedDateRange',
            payload: {
              start: moment()
                .subtract(7, 'days')
                .format('YYYY MM DD'),
              end: moment().format('YYYY MM DD'),
            },
          })
        );
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
