export default {
  namespace: 'user',

  state: {
    favoriteControllers: [],
    favoriteResults: [],
    // user: {},
  },

  effects: {
    // *loadUser({ payload }, { put }) {
    //   yield put({
    //     type: 'modifyUser',
    //     payload,
    //   });
    // },
    // *logoutUser({ put }) {
    //   yield put({
    //     type: 'removeUser',
    //   });
    // },
    *favoriteController({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedControllers',
        payload,
      });
    },
    *favoriteResult({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedResults',
        payload,
      });
    },
  },

  reducers: {
    // modifyUser(state, { payload }) {
    //   return {
    //     ...state,
    //     user: payload,
    //   };
    // },
    // removeUser(state) {
    //   return {
    //     ...state,
    //     user: {},
    //   };
    // },
    modifyFavoritedControllers(state, { payload }) {
      return {
        ...state,
        favoriteControllers: [...state.favoriteControllers, payload],
      };
    },
    modifyFavoritedResults(state, { payload }) {
      return {
        ...state,
        favoriteResults: [...state.favoriteResults, payload],
      };
    },
  },
};
