/* eslint-disable no-undef */
import request from '../utils/request';

const { endpoints } = window;

export async function getSession(params) {
  const { sessionId } = params;
  const endpoint = MOCK_UI
    ? `${endpoints.pbench_server}/sessions/create`
    : `${endpoints.api.graphql}`;
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
        id: sessionId,
      },
    },
  });
}

// queries all the available shared sessions from the database to display
export async function getAllSessions() {
  const endpoint = MOCK_UI
    ? `${endpoints.pbench_server}/sessions/list`
    : `${endpoints.api.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
        query {
          sessions {
              id
              config
              description
              updatedAt
          }   
        }`,
    },
  });
}

export async function saveSession(params) {
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

// Updates the description of shared session, provided by the user in the database.
export async function updateSessionDescription(params) {
  const { sessionId, description } = params;

  const endpoint = `${endpoints.api.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
        mutation($description: String!,$id: ID!) {
        updateSession(
          data: {description: $description}
          where: {id: $id})
        {
          id
          config
          description
        }
      }`,
      variables: {
        id: sessionId,
        description,
      },
    },
  });
}

// Deletes a shared session.
export async function deleteSession(params) {
  const { sessionId } = params;

  const endpoint = `${endpoints.api.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
      mutation($id: ID!) {
        deleteSession(where: {id: $id})
          {
            id
            description
            config
          }
        }`,
      variables: {
        id: sessionId,
      },
    },
  });
}
