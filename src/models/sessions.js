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
      const { response, data } = yield call(getSession, payload);

      if (response.ok) {
        const { config } = data.data.createSession;
        const parsedSessionConfig = JSON.parse(config);
        return {
          sessionConfig: parsedSessionConfig,
          sessionMetadata: data.data,
        };
      }

      return {};
    },
    *fetchAllSessions({ payload }, { call, put }) {
      const { response, data } = yield call(getAllSessions, payload);

      if (response.ok) {
        yield put({
          type: 'getAllSessions',
          payload: data.data.sessions,
        });
      }
    },
    *saveSession({ payload }, { call }) {
      const { data } = yield call(saveSession, payload);
      return data;
    },
    *deleteSession({ payload }, { call }) {
      const { data } = yield call(deleteSession, payload);
      return data;
    },
    *updateSessionDescription({ payload }, { call }) {
      const { data } = yield call(updateSessionDescription, payload);
      return data;
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
