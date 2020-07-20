import request from '../utils/request';

export async function queryIndexMapping(params) {
  const { datastoreConfig, indices } = params;

  const url = `${datastoreConfig.elasticsearch}/${datastoreConfig.prefix}${
    datastoreConfig.run_index
  }${indices[0]}/_mappings`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
    },
  });
}

export async function searchQuery(params) {
  const { datastoreConfig, selectedFields, selectedIndices, query } = params;

  let indices = '';
  selectedIndices.forEach(value => {
    indices += `${datastoreConfig.prefix + datastoreConfig.run_index + value},`;
  });

  const url = `${datastoreConfig.elasticsearch}/${indices}/_search`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
      payload: {
        size: 10000,
        sort: [
          {
            '@timestamp': {
              order: 'desc',
              unmapped_type: 'boolean',
            },
          },
        ],
        query: {
          filtered: {
            query: {
              query_string: {
                query: `*${query}*`,
                analyze_wildcard: true,
              },
            },
          },
        },
        fields: selectedFields,
      },
    },
  });
}
