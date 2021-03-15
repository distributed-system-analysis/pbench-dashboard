import { extend } from 'umi-request';

const request = extend({
  errorHandler: error => {
    throw error;
  },
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
