import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

const codeMessage = {
  200: 'The server successfully returned the requested data. ',
  201: 'New or modified data is successful. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'The data was deleted successfully. ',
  400: 'The request returned an error and the server did not perform any new or modified data operations. ',
  401: 'User does not have permission (token, username, or password is incorrect). ',
  403: 'The user is authorized, but access is forbidden. ',
  404: 'The request was made for a record that does not exist. ',
  406: 'The format of the request is not available. ',
  410: 'The requested resource is permanently deleted and will not be retrieved. ',
  422: 'A validation error occurred when creating an object. ',
  500: 'An error occurred on the server. Please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained. ',
  504: 'The gateway timed out. ',
};

const customMessages = new Set([
  'A user with that name already exists.',
  'No such user, please register first',
  'Bad login',
  'Retry login after some time',
]);

const errorHandler = error => {
  const {
    response = {},
    data: { message },
  } = error;
  const errortext = message || codeMessage[response.status];
  const { status } = response;

  // handles special cases where we
  // do not have to redirect to the
  // exceptions page.
  if (customMessages.has(message)) {
    return {
      message,
      status: 'failure',
    };
  }

  notification.error({
    message: `Request Error ${status}`,
    description: errortext,
  });

  // redirect to the exception page
  // for general cases
  if (status === 403) {
    router.push('/exception/403');
  }
  if (status === 404) {
    router.push('/exception/404');
  }
  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
  }
  if (status >= 405 && status < 422) {
    router.push('/exception/404');
  }
  return {
    message: errortext,
    status: 'failure',
  };
};

const request = extend({
  errorHandler,
});

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
