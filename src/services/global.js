import request from '../utils/request';

const { endpoints } = window;

export async function saveUserSession(params) {
  const { sessionConfig, description } = params;
  return request.post(endpoints.graphql, {
    data: {
      query: `
            mutation($config: String!, $description: String!) {
              createUrl(data: {config: $config, description: $description}) {
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
  return request.post(endpoints.graphql, {
    data: {
      query: `
        query($id: ID!) {
            url(where: {id: $id}) {
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
