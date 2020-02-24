export default {
  namespace: 'auth',

  state: {
    auth: {},
  },

  effects: {
    *loadUser({ payload }, { put }) {
      yield put({
        type: 'modifyUser',
        payload,
      });
    },
    *logoutUser({ put }) {
      yield put({
        type: 'removeUser',
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
    removeUser(state) {
      return {
        ...state,
        auth: {},
      };
    },
  },
};
