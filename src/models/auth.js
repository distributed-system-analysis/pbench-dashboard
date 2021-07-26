import { routerRedux } from 'dva/router';
import { postRegisterUser, postLoginUser, postLogoutUser } from '../services/auth.js';

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
    *loginUser({ payload }, { call, put, all }) {
      const { response, data } = yield call(postLoginUser, payload);
      if (response.ok) {
        const { auth_token, username } = data;
        localStorage.setItem('token', auth_token);
        yield all([
          yield put({
            type: 'loginSuccess',
            payload: {
              username,
            },
          }),
          yield put(routerRedux.push('/overview')),
        ]);
      }
    },
    *registerUser({ payload }, { call, put, all }) {
      const { response, data } = yield call(postRegisterUser, payload);
      if (response.ok) {
        yield all([
          yield put({
            type: 'error/updateAlertMessage',
            payload: {
              type: 'success',
              message: data || 'Successfully registered',
            },
          }),
          yield put(routerRedux.push('/login')),
        ]);
      }
    },
    *logoutUser({ payload }, { call, put, all }) {
      yield call(postLogoutUser, payload);
      // even when the request fails,
      // we need to remove credentials and user.
      localStorage.removeItem('token');
      yield all([
        yield put({
          type: 'logoutSuccess',
        }),
        yield put(routerRedux.push('/')),
      ]);
    },
    *removeUserFromStore({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
  },

  reducers: {
    loginSuccess(state, { payload }) {
      const { username } = payload;
      return {
        ...state,
        username,
      };
    },
    logoutSuccess(state) {
      return {
        ...state,
        username: '',
      };
    },
    // A failure in logout also removes
    // the user from the Redux store.
    // We do not want users to be blocked
    // on log out failures.
    logoutFailure(state) {
      return {
        ...state,
        username: '',
      };
    },
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
