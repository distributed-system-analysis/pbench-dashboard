import { queryRegisterUser, queryLoginUser, queryLogoutUser } from '../services/auth';

export default {
  namespace: 'auth',

  state: {
    auth: { username: '' },
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
    *logoutUser({ payload }, { call }) {
      const response = yield call(queryLogoutUser, payload);
      // TODO: Must be removed from the backend through
      // the response header.
      localStorage.removeItem('token');
      return response;
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
        auth: payload,
      };
    },
  },
};
