export default {
  namespace: 'global',

  state: {
    selectedIndices: [],
    selectedDateRange: {
      start: '',
      end: '',
    },
    selectedResults: [],
    selectedControllers: [],
    selectedFields: [],
    selectedIterations: [],
  },

  effects: {
    *rehydrateSession({ payload }, { put }) {
      yield put({
        type: 'rehydrateGlobal',
        payload: payload.global,
      });
      yield put({
        type: 'dashboard/rehydrate',
        payload: payload.dashboard,
      });
      yield put({
        type: 'search/rehydrate',
        payload: payload.search,
      });
    },
    *updateSelectedDateRange({ payload }, { put }) {
      yield put({
        type: 'modifySelectedDateRange',
        payload,
      });
    },
    *updateSelectedControllers({ payload }, { put }) {
      yield put({
        type: 'modifySelectedControllers',
        payload,
      });
    },
    *updateSelectedResults({ payload }, { put }) {
      yield put({
        type: 'modifySelectedResults',
        payload,
      });
    },
    *updateSelectedFields({ payload }, { put }) {
      yield put({
        type: 'modifySelectedFields',
        payload,
      });
    },
    *updateSelectedIterations({ payload }, { put }) {
      yield put({
        type: 'modifySelectedIterations',
        payload,
      });
    },
  },

  reducers: {
    rehydrateGlobal(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    modifySelectedDateRange(state, { payload }) {
      return {
        ...state,
        selectedDateRange: payload,
      };
    },
    modifySelectedControllers(state, { payload }) {
      return {
        ...state,
        selectedControllers: payload,
      };
    },
    modifySelectedResults(state, { payload }) {
      return {
        ...state,
        selectedResults: payload,
      };
    },
    modifySelectedFields(state, { payload }) {
      return {
        ...state,
        selectedFields: payload,
      };
    },
    modifySelectedIterations(state, { payload }) {
      return {
        ...state,
        selectedIterations: payload,
      };
    },
  },
};
