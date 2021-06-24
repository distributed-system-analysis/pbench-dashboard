import { extend } from 'umi-request';
import  { getDvaApp } from 'umi';

const request = extend({
  getResponse: true,
  errorHandler: (error) => {
    const { data, response: { status }} = error;
    const app = getDvaApp();
    console.log(app);
    app._store.dispatch({
      type: 'error/updateAlertMessage',
      payload: {
        type: 'error',
        error
      }
    })
  }
});

// request.interceptors.response.use(async response => {
//   const data = response.clone();
//   const { ok, statusText, redirected, status } = data;
//   const res = {
//     ok,
//     status,
//     body: await data.json(),
//     statusText,
//     redirected,
//   };
//   return res;
// });

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
