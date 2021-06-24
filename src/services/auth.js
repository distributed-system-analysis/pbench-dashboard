import request from '../utils/request';

const { endpoints } = window;

export const queryRegisterUser = async params => {
  const endpoint = `http://localhost:5000/register`;
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

/**
 * Queries pbench server for a login action
 *
 * @param {username} username
 * @param {password} password
 * @return { ok, response, error }
 */
export const requestLoginUser = async params => {
  const endpoint = `http://localhost:5000/login`;
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
  const endpoint = `${endpoints.pbench_server}/logout`;
  return request.post(endpoint, {
    data: {},
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};
