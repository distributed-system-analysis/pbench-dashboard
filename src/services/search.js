import { getAllMonthsWithinRange } from '../utils/moment_constants';
import request from '../utils/request';

const { endpoints } = window;

export async function queryIndexMapping(params) {
  const { indices } = params;

  const endpoint = `${endpoints.elasticsearch}/${endpoints.prefix}${endpoints.run_index}${
    indices[0]
  }/_mappings`;
  return request.get(endpoint);
}

export async function searchQuery(params) {
  try {
    const { selectedFields, selectedDateRange, query } = params;

    const endpoint = `${endpoints.elasticsearch}/${getAllMonthsWithinRange(
      endpoints,
      endpoints.run_index,
      selectedDateRange
    )}/_search`;

    return request.post(endpoint, {
      params: {
        ignore_unavailable: true,
      },
      data: {
        size: 10000,
        query: {
          bool: {
            filter: {
              range: {
                '@timestamp': {
                  gte: selectedDateRange.start,
                  lte: selectedDateRange.end,
                },
              },
            },
            must: {
              query_string: {
                query: `*${query}*`,
                analyze_wildcard: true,
              },
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
        _source: { include: selectedFields },
      },
    });
  } catch (error) {
    throw error;
  }
}
