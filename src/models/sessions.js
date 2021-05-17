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
    *fetchSession({ payload }, { call, put }) {
      try {
        const response = yield call(getSession, payload);
        const { config } = response.data.session;
        const parsedSessionConfig = JSON.parse(config);
        return {
          sessionConfig: parsedSessionConfig,
          sessionMetadata: response.data.session,
        };
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
        return false;
      }
    },
    *fetchAllSessions({ payload }, { call, put }) {
      try {
        const response = yield call(getAllSessions, payload);
        yield put({
          type: 'getAllSessions',
          payload: response.data.sessions,
        });
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
      }
    },
    *saveSession({ payload }, { call, put }) {
      try {
        const response = yield call(saveSession, payload);
        return response;
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
        return false;
      }
    },
    *deleteSession({ payload }, { call, put }) {
      try {
        const response = yield call(deleteSession, payload);
        return response;
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
        return false;
      }
    },
    *updateSessionDescription({ payload }, { call, put }) {
      try {
        const response = yield call(updateSessionDescription, payload);
        return response;
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
        return false;
      }
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
