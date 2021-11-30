import request from '../utils/request';

const { endpoints } = window;

export const postRegisterUser = async params => {
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

export const postLoginUser = params => {
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

export const postLogoutUser = () => {
  const endpoint = `${endpoints.api.logout}`;
  return request.post(endpoint, {
    data: {},
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const putUpdateNewPassword = params => {
  const { temporaryToken, password } = params;
  const endpoint = `${endpoints.api.reset_password}`;
  return request.put(endpoint, {
    data: {
      // First name is expected
      // on the server side.
      password,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${temporaryToken}`,
    },
  });
};
