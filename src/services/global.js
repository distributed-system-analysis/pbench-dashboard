import request from '../utils/request';

const { endpoints } = window;

export async function saveUserSession(params) {
  const { sessionConfig, description } = params;
  const endpoint = `${endpoints.api.graphql}`;
  return request.post(endpoint, {
    data: {
      query: `
            mutation($config: String!, $description: String!) {
              createSession(data: {config: $config, description: $description}) {
                id
                config
                description
              }
            }       
          `,
      variables: {
        config: sessionConfig,
        description,
      },
    },
  });
}

export async function queryUserSession(params) {
  const { id } = params;
  const endpoint = `${endpoints.api.graphql}`;
  return request.post(endpoint, {
    data: {
      query: `
        query($id: ID!) {
            session(where: {id: $id}) {
                id
                config
                description
            }
      }`,
      variables: {
        id,
      },
    },
  });
}
