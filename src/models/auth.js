import { routerRedux } from 'dva/router';
import { queryRegisterUser, queryLoginUser, queryLogoutUser } from '../services/auth.js';

export default {
  namespace: 'auth',

  state: {
    username: '',
    errorMessage: '',
    successMessage: '',
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
      try {
        const response = yield call(queryLoginUser, payload);
        const { auth_token, username } = response;
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
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'loginFailure',
          payload: errortext,
        });
      }
    },
    *registerUser({ payload }, { call, put, all }) {
      try {
        const response = yield call(queryRegisterUser, payload);
        const { message } = response;
        yield all([
          yield put({
            type: 'registerSuccess',
            payload: message,
          }),
          yield put(routerRedux.push('/login')),
        ]);
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'registerFailure',
          payload: errortext,
        });
      }
    },
    *logoutUser({ payload }, { call, put, all }) {
      try {
        yield call(queryLogoutUser, payload);
        localStorage.removeItem('token');
        yield all([
          yield put({
            type: 'logoutSuccess',
          }),
          yield put(routerRedux.push('/')),
        ]);
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'logoutFailure',
          payload: errortext,
        });
      }
    },
    *removeUserFromStore({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
    *removeErrorMessage({ payload }, { put }) {
      yield put({
        type: 'modifyErrorMessage',
        payload,
      });
    },
    *removeSuccessMessage({ payload }, { put }) {
      yield put({
        type: 'modifySuccessMessage',
        payload,
      });
    },
  },

  reducers: {
    loginSuccess(state, { payload }) {
      const { username } = payload;
      return {
        ...state,
        errorMessage: '',
        username,
      };
    },
    loginFailure(state, { payload }) {
      return {
        ...state,
        errorMessage: payload,
      };
    },
    registerSuccess(state, { payload }) {
      return {
        ...state,
        successMessage: payload,
        errorMessage: '',
      };
    },
    registerFailure(state, { payload }) {
      return {
        ...state,
        errorMessage: payload,
        successMessage: '',
      };
    },
    logoutSuccess(state) {
      return {
        ...state,
        username: '',
        errorMessage: '',
        successMessage: '',
      };
    },
    // A failure in logout also removes
    // the user from the Redux store.
    // We do not want users to be blocked
    // on log out failures.
    logoutFailure(state, { payload }) {
      return {
        ...state,
        username: '',
        errorMessage: payload,
        successMessage: '',
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
    modifyErrorMessage(state, { payload }) {
      return {
        ...state,
        errorMessage: payload,
      };
    },
    modifySuccessMessage(state, { payload }) {
      return {
        ...state,
        successMessage: payload,
      };
    },
  },
};
