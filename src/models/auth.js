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
