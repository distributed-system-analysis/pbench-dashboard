import { queryRegisterUser, queryLoginUser } from '../services/auth';

export default {
  namespace: 'auth',

  state: {
    auth: { username: '' },
    token: '',
  },

  effects: {
    *loadUser({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
    *loginUser({ payload }, { call }) {
      const response = yield call(queryLoginUser, payload);
      localStorage.setItem('token', response.auth_token);
      return response;
    },
    *registerUser({ payload }, { call }) {
      const response = yield call(queryRegisterUser, payload);
      return response;
    },
    *logoutUser({ payload }, { put }) {
      yield put({
        type: 'removeUser',
        payload,
      });
    },
  },

  reducers: {
    modifyUser(state, { payload }) {
      return {
        ...state,
        auth: payload,
      };
    },
    removeUser() {
      return {
        auth: { username: '' },
      };
    },
  },
};
