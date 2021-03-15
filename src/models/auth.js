import { queryRegisterUser, queryLoginUser, queryLogoutUser } from '../services/auth.js';

export default {
  namespace: 'auth',

  state: {
    username: '',
  },

  effects: {
    *loadUser({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
    /* eslint-disable camelcase */
    // TODO: Design a basic codeMap
    // for general purpose messages.
    *loginUser({ payload }, { call }) {
      try {
        const response = yield call(queryLoginUser, payload);
        const { message, auth_token } = response;
        return {
          message,
          auth_token,
          status: 'success',
        };
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        return {
          message: errortext,
          status: 'failure',
        };
      }
    },
    *registerUser({ payload }, { call }) {
      try {
        const response = yield call(queryRegisterUser, payload);
        const { message } = response;
        return {
          message,
          status: 'success',
        };
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        return {
          message: errortext,
          status: 'failure',
        };
      }
    },
    *logoutUser({ payload }, { call }) {
      try {
        const response = yield call(queryLogoutUser, payload);
        const { message } = response;
        return {
          message,
          status: 'success',
        };
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        return {
          message: errortext,
          status: 'failure',
        };
      }
    },
    *removeUserFromStore({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
  },

  reducers: {
    modifyUser(state, { payload }) {
      return {
        ...state,
        username: payload,
      };
    },
    removeUser(state) {
      return {
        ...state,
        username: '',
      };
    },
  },
};
