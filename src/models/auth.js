import { routerRedux } from 'dva/router';
import { queryRegisterUser, requestLoginUser, queryLogoutUser } from '../services/auth.js';
import generateAlertMessage from '@/utils/codeMessages';

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
      // TODO: rename queryLoginUser -> postLogin
      const response = yield call(requestLoginUser, payload);
      console.log(response);
      // yield all([
      //   yield put({ type: 'loginSuccess', payload: { username }}),
      //   yield put(routerRedux.push('/private'))
      // ])
      // const { ok, response, error } = yield call(requestLoginUser, payload);
      // if (response && ok) {
      //   const {
      //     body: { auth_token, username },
      //   } = response;
      //   localStorage.setItem('token', auth_token);
      //   yield all([
      //     yield put({ type: 'loginSuccess', payload: { username } }),
      //     // context pointing to where the user was before he logged in.
      //     yield put(routerRedux.push('/private')),
      //   ]);
      // } else yield put({
      //   type: 'error/updateAlertMessage',
      //   payload: {
      //     type: 'error',
      //     error: error || response,
      //   },
      // });
    },
    *registerUser({ payload }, { call, put, all }) {
      try {
        const {
          status,
          ok,
          body: { message },
        } = yield call(queryRegisterUser, payload);
        if (ok) {
          yield all([
            yield put({
              type: 'registerSuccess',
              payload: {
                type: 'success',
                message: generateAlertMessage(message, status),
              },
            }),
            yield put(routerRedux.push('/login')),
          ]);
        } else {
          yield put({
            type: 'error/updateAlertMessage',
            payload: {
              type: 'error',
              message: generateAlertMessage(message, status),
            },
          });
        }
      } catch (errorResponse) {
        const {
          body: { message },
          status,
        } = errorResponse;
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            type: 'error',
            message: generateAlertMessage(message, status),
          },
        });
      }
    },
    *logoutUser({ payload }, { call, put, all }) {
      try {
        const response = yield call(queryLogoutUser, payload);
        localStorage.removeItem('token');
        yield all([
          yield put({
            type: 'logoutSuccess',
          }),
          yield put(routerRedux.push('/')),
        ]);
      } catch (errorResponse) {
        const {
          body: { message },
          status,
        } = errorResponse;
        yield put({
          type: 'logoutFailure',
          payload: message || codeMessages[status],
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
