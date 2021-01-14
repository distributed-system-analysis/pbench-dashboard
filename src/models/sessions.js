import {
  getSession,
  getAllSessions,
  saveSession,
  deleteSession,
  updateSessionDescription,
} from '../services/sessions';

export default {
  namespace: 'sessions',

  state: {
    sessions: [],
    sessionBannerVisible: false,
    sessionDescription: '',
    sessionId: '',
  },

  effects: {
    *fetchSession({ payload }, { call }) {
      const response = yield call(getSession, payload);
      const { config } = response.data.session;
      const parsedSessionConfig = JSON.parse(config);
      return {
        sessionConfig: parsedSessionConfig,
        sessionMetadata: response.data.session,
      };
    },
    *fetchAllSessions({ payload }, { call, put }) {
      const response = yield call(getAllSessions, payload);
      yield put({
        type: 'getAllSessions',
        payload: response.data.sessions,
      });
    },
    *saveSession({ payload }, { call }) {
      const response = yield call(saveSession, payload);
      return response;
    },
    *deleteSession({ payload }, { call }) {
      const response = yield call(deleteSession, payload);
      return response;
    },
    *updateSessionDescription({ payload }, { call }) {
      const response = yield call(updateSessionDescription, payload);
      return response;
    },
    *startSession({ payload }, { put }) {
      yield put({
        type: 'startUserSession',
        payload: {
          sessionBannerVisible: true,
          sessionDescription: payload.description,
          sessionId: payload.id,
        },
      });
    },
    *exitSession({ put }) {
      yield put({
        type: 'exitUserSession',
      });
    },
  },

  reducers: {
    getAllSessions(state, { payload }) {
      return {
        ...state,
        sessions: payload,
      };
    },
    startUserSession(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    exitUserSession(state) {
      return {
        ...state,
        sessionBannerVisible: false,
        sessionDescription: '',
        sessionId: '',
      };
    },
  },
};
