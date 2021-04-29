export default {
  namespace: 'user',

  state: {
    favoriteControllers: [],
    favoriteResults: [],
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
      return {
        ...state,
        favoriteControllers: [...state.favoriteControllers, payload],
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
        favoriteResults: Array.isArray(payload)
          ? [...state.favoriteResults, ...payload]
          : [...state.favoriteResults, payload],
      };
    },
    removeFavoriteController(state, { payload }) {
      return {
        ...state,
        favoriteControllers: state.favoriteControllers.filter(item => item !== payload),
      };
    },
    removeFavoriteResult(state, { payload }) {
      return {
        ...state,
        favoriteResults: state.favoriteResults.filter(item => item !== payload),
      };
    },
    removeSeenResults(state, { payload }) {
      return {
        ...state,
        seenResults: state.seenResults.filter(item => !payload.includes(item)),
      };
    },
  },
};
