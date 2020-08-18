import request from '../utils/request';

export default function registerUser(params) {
  const { datastoreConfig, firstName, lastName, username, password } = params;

  const endpoint = `${datastoreConfig.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
        mutation($username: String!, $password: String!, $firstName: String!, $lastName: String!) {
          register(username: $username, password: $password, firstName: $firstName, lastName: $lastName) {
            id
            firstName
            lastName
            username
        }
      }`,
      variables: {
        username,
        password,
        firstName,
        lastName,
      },
    },
  });
}
