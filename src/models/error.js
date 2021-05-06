import { routerRedux } from 'dva/router';
import query from '../services/error';

export default {
  namespace: 'error',

  state: {
    errorMessage: '',
    successMessage: '',
    isloading: false,
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield call(query, payload.code);
      // redirect on client when network broken
      yield put(routerRedux.push(`/exception/${payload.code}`));
      yield put({
        type: 'trigger',
        payload: payload.code,
      });
    },
    *updateAlertMessage({ payload }, { put }) {
      yield put({
        type: 'addAlertMessage',
        payload,
      });
    },
    *clearAlertMessage({ payload }, { put }) {
      yield put({
        type: 'removeAlertMesage',
        payload,
      });
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        ...state,
        errorMessage: action.payload,
      };
    },
    addAlertMessage(state, { payload }) {
      const { messageType, message } = payload;
      if (messageType === 'error') {
        return {
          ...state,
          errorMessage: message,
        };
      }
      return {
        ...state,
        successMessage: message,
      };
    },
    removeAlertMesage(state, { payload }) {
      if (payload === 'error') {
        return {
          ...state,
          errorMessage: '',
        };
      }
      return {
        ...state,
        successMessage: '',
      };
    },
  },
};
