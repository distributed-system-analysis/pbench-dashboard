import request from '../utils/request';

const { endpoints } = window;

// queries all the available shared sessions from the database to display
export async function querySharedSessions() {
  const endpoint = `${endpoints.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
        query {
          urls {
              id
              config
              description
              created
          }   
        }`,
    },
  });
}

// Updates the description of shared session, provided by the user in the database.
export async function updateDescription(params) {
  const { id, value } = params;

  const endpoint = `${endpoints.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
        mutation($description: String!,$id: ID!) {
        updateUrl(
          data: {description: $description}
          where: {id: $id})
        {
          id
          config
          description
        }
      }`,
      variables: {
        id,
        description: value,
      },
    },
  });
}

// Deletes a shared session.
export async function deleteSharedSessions(params) {
  const { id } = params;

  const endpoint = `${endpoints.graphql}`;

  return request.post(endpoint, {
    data: {
      query: `
      mutation($id: ID!) {
        deleteUrl(where: {id: $id})
          {
            id
            description
            config
          }
        }`,
      variables: {
        id,
      },
    },
  });
}
