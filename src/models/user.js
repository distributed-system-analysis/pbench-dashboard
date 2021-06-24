export default {
  namespace: 'user',

  state: {
    favoriteControllers: [],
    favoriteResults: [],
    // user: {},
    seenResults: [],
  },

  effects: {
    *favoriteController({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedControllers',
        payload,
      });
    },
    *markResultSeen({ payload }, { put }) {
      yield put({
        type: 'modifySeenResults',
        payload,
      });
    },
    *removeControllerFromFavorites({ payload }, { put }) {
      yield put({
        type: 'removeFavoriteController',
        payload,
      });
    },
    *favoriteResult({ payload }, { put }) {
      yield put({
        type: 'modifyFavoritedResults',
        payload,
      });
    },
    *removeResultFromFavorites({ payload }, { put }) {
      yield put({
        type: 'removeFavoriteResult',
        payload,
      });
    },
    *removeResultFromSeen({ payload }, { put }) {
      yield put({
        type: 'removeSeenResults',
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
      state.favoriteControllers.push(...payload);
      return {
        ...state,
        favoriteControllers: state.favoriteControllers,
      };
    },
    modifySeenResults(state, { payload }) {
      return {
        ...state,
        seenResults: [...state.seenResults, payload],
      };
    },
    modifyFavoritedResults(state, { payload }) {
      return {
        ...state,
        favoriteResults: [...state.favoriteResults, payload],
      };
    },
    removeFavoriteController(state, { payload }) {
      return {
        ...state,
        favoriteControllers: state.favoriteControllers.filter(item => item.key !== payload.key),
      };
    },
    removeFavoriteResult(state, { payload }) {
      return {
        ...state,
        favoriteResults: state.favoriteResults.filter(item => item.key !== payload.key),
      };
    },
    removeSeenResults(state, { payload }) {
      const newSeenResults = state.seenResults.filter(function(obj) {
        return !this.has(obj.original.key);
      }, new Set(payload.map(obj => obj.original.key)));
      return {
        ...state,
        seenResults: newSeenResults,
      };
    },
  },
};
