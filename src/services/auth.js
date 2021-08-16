import request from '../utils/request';

const { endpoints } = window;

export const queryRegisterUser = async params => {
  const endpoint = `${endpoints.api.register}`;
  const { username, password, email, firstName, lastName } = params;
  return request.post(endpoint, {
    data: {
      username,
      password,
      email,
      first_name: firstName,
      last_name: lastName,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const queryLoginUser = params => {
  const endpoint = `${endpoints.api.login}`;
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

export const queryLogoutUser = () => {
  const endpoint = `${endpoints.api.logout}`;
  return request.post(endpoint, {
    data: {},
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};
