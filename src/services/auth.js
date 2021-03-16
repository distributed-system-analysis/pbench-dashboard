import request from '../utils/request';

const { endpoints } = window;

export const queryRegisterUser = async params => {
  const endpoint = `${endpoints.pbench_server}/register`;
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
