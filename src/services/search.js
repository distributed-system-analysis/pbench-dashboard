/* eslint-disable no-undef */
import { getAllMonthsWithinRange } from '../utils/moment_constants';
import request from '../utils/request';

const { endpoints } = window;

export async function queryIndexMapping(params) {
  const { indices } = params;

  const mappings = `${endpoints.indices.run_index}${indices[0]}/_mappings`;

  const endpoint = MOCK_UI
    ? endpoints.api.mappings
    : endpoints.api.elasticsearch;

  return request.post(endpoint, { data: { indices: mappings } });
}

export async function searchQuery(params) {
  try {
    const { selectedFields, selectedDateRange, query } = params;

    const indices = `${getAllMonthsWithinRange(
      endpoints,
      endpoints.run_index,
      selectedDateRange
    )}/_search`;

    const endpoint = MOCK_UI
      ? endpoints.api.search
      : endpoints.api.elasticsearch;

    return request.post(endpoint, {
      data: {
        indices,
        params: {
          ignore_unavailable: true,
        },
        payload: {
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
      },
    });
  } catch (error) {
    throw error;
  }
}
