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
