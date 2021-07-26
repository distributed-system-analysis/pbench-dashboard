import { getDvaApp } from 'umi';
import { extend } from 'umi-request';
import getAlertMessage from './codeMessages';

const request = extend({
  errorHandler: error => {
    const { data, response } = error;
    const app = getDvaApp();

    app._store.dispatch({
      type: 'error/updateAlertMessage',
      payload: {
        type: 'error',
        message: data.message || getAlertMessage(response.status),
      },
    });

    // we return data and response
    // here to provide a uniform return
    // on success and failure. On a success,
    // a typical umi request returns an object
    // which contains data and response fields.
    return {
      data,
      response,
    };
  },
  getResponse: true,
});

// Embeds authorization token with every request.
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }
  return {
    url,
    options,
  };
});

export default request;
