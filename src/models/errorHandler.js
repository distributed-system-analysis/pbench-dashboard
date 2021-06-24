import errorModel from './error';
import { put } from 'redux-saga/effects';

function* handle(error, response) {
  return yield put({
    type: 'error/updateAlertMessage',
    payload: {
      type: 'error',
      error: response,
    },
  });
}

export default handle;
