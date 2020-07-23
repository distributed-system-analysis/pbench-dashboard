import { getAllMonthsWithinRange } from '../utils/moment_constants';
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
  try {
    const { datastoreConfig, selectedFields, selectedDateRange, query } = params;

    const url = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
      datastoreConfig,
      datastoreConfig.run_index,
      selectedDateRange
    )}/_search`;

    const endpoint = `${datastoreConfig.test_server}/download`;

    return request.post(endpoint, {
      data: {
        url,
        payload: {
          params: {
            ignore_unavailable: true,
          },
          data: {
            size: 10000,
            filter: {
              range: {
                '@timestamp': {
                  gte: selectedDateRange.start,
                  lte: selectedDateRange.end,
                },
              },
            },
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
      },
    });
  } catch (error) {
    throw error;
  }
}
