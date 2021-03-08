import request from '../utils/request';

const { endpoints } = window;

export const queryRegisterUser = async params => {
  const endpoint = `${endpoints.pbench_server}/user`;
  const { username, password, email, firstName, lastName } = params;
  return request.post(endpoint, {
    data: {
      username,
      password,
      email,
      firstName,
      lastName,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const queryLoginUser = params => {
  const endpoint = `http://127.0.0.1:5000/session`;
  const { username, password } = params;
  return request.post(endpoint, {
    data: {
      username,
      password,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};
