export default {
  namespace: 'error',

  state: {
    errorMessage: '',
    successMessage: '',
    isloading: false,
  },

  effects: {
    *updateAlertMessage({ payload }, { put }) {
      // fan out error message based on its type
      const { type, message } = payload;
      switch (type) {
        case 'error':
          yield put({
            type: 'addAlertErrorMessage',
            payload: message,
          });
          break;
        case 'success':
          yield put({
            type: 'addAlertSuccessMessage',
            payload: message,
          });
          break;
        default:
          break;
      }
    },
    *clearAlertMessage({ payload }, { put }) {
      const { type } = payload;
      switch (type) {
        case 'error':
          yield put({
            type: 'removeErrorAlertMessage',
          });
          break;
        case 'success':
          yield put({
            type: 'removeSuccessAlertMessage',
          });
          break;
        default:
          break;
      }
    },
  },

  reducers: {
    trigger(state, action) {
      return {
        error: action.payload,
      };
    },
    addAlertErrorMessage(state, { payload }) {
      return {
        ...state,
        successMessage: '',
        errorMessage: payload,
      };
    },
    addAlertSuccessMessage(state, { payload }) {
      return {
        ...state,
        errorMessage: '',
        successMessage: payload,
      };
    },
    removeErrorAlertMessage(state) {
      return {
        ...state,
        errorMessage: '',
      };
    },
    removeErrorSuccessMessage(state) {
      return {
        ...state,
        successMessage: '',
      };
    },
  },
};
