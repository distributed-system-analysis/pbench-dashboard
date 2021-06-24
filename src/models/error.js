import { routerRedux } from 'dva/router';
import query from '../services/error';
import generateAlertMessage from '@/utils/codeMessages';

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
      console.log(payload);
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
      console.log("called");
      const { type, error, response } = payload;
      console.log(payload);
      switch (type) {
        case 'error':
          return {
            ...state,
            errorMessage: generateAlertMessage(error),
          };
        case 'success':
          return {
            ...state,
            successMessage: generateAlertMessage(response),
          };
      }
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
