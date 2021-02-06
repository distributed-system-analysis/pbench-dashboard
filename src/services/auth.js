import request from '../utils/request';

const { endpoints } = window;

const queryRegisterUser = async params => {
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

export default queryRegisterUser;
