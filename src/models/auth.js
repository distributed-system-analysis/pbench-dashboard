import registerUser from '../services/auth';

export default {
  namespace: 'auth',

  state: {
    username: '',
  },

  effects: {
    *registerUser({ payload }, { call }) {
      const response = yield call(registerUser, payload);
      return response;
    },
    *loginUser({ put }) {
      yield put({
        type: 'updateUserMetadata',
      });
    },
    *logoutUser({ put }) {
      yield put({
        type: 'removeUserMetadata',
      });
    },
  },

  reducers: {
    updateUserMetadata(state, { payload }) {
      return {
        ...state,
        username: payload,
      };
    },
    removeUserMetadata(state) {
      return {
        ...state,
        username: '',
      };
    },
  },
};
