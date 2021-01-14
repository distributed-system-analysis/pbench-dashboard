/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import request from '../utils/request';
import { getAllMonthsWithinRange } from '../utils/moment_constants';

const { endpoints } = window;

function scrollUntilEmpty(data) {
  const endpoint = `${endpoints.elasticsearch}/_search/scroll?scroll=1m`;
  const allData = data;

  if (allData.hits.total.value !== allData.hits.hits.length && allData._scroll_id) {
    const scroll = request.post(`${endpoint}&scroll_id=${allData._scroll_id}`);
    scroll.then(response => {
      allData._scroll_id = response._scroll_id;
      allData.hits.total = response.hits.total;
      allData.hits.hits = [...allData.hits.hits, ...response.hits.hits];
      return scrollUntilEmpty(endpoints, allData);
    });
  }
  return allData;
}

export async function queryControllers(params) {
  try {
    const { selectedDateRange } = params;

    return request.post(`${endpoints.pbench_server}/controllers/list`, {
      data: {
        user: 'username', // TODO: Will need to get user context here
        start: selectedDateRange.start,
        end: selectedDateRange.end,
      },
      headers: {
        Authorization: 'Bearer xyzzy', // TODO: real auth token
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function queryResults(params) {
  try {
    const { selectedDateRange, controller } = params;

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
        _source: {
          includes: [
            '@metadata.controller_dir',
            '@metadata.satellite',
            'run.controller',
            'run.start',
            'run.end',
            'run.name',
            'run.config',
            'run.prefix',
            'run.id',
          ],
        },
        sort: {
          'run.end': {
            order: 'desc',
          },
        },
        query: {
          match: {
            'run.controller': controller[0],
          },
        },
        size: 5000,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function queryResult(params) {
  const { selectedDateRange, result } = params;

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
      query: {
        match: {
          'run.name': result,
        },
      },
      sort: '_index',
    },
  });
}

export async function queryTocResult(params) {
  const { selectedDateRange, id } = params;

  const endpoint = `${endpoints.elasticsearch}/${getAllMonthsWithinRange(
    endpoints,
    endpoints.run_toc_index,
    selectedDateRange
  )}/_search?q=run_data_parent:"${id}"`;

  return request.post(endpoint, {
    params: {
      ignore_unavailable: true,
    },
  });
}

export async function queryIterationSamples(params) {
  const { selectedDateRange, selectedResults } = params;

  const endpoint = `${endpoints.elasticsearch}/${getAllMonthsWithinRange(
    endpoints,
    endpoints.result_index,
    selectedDateRange
  )}/_search?scroll=1m`;

  const iterationSampleRequests = [];
  selectedResults.forEach(run => {
    iterationSampleRequests.push(
      request.post(endpoint, {
        params: {
          ignore_unavailable: true,
        },
        data: {
          size: 1000,
          query: {
            match: {
              'run.id': run.id,
            },
          },
          aggs: {
            id: {
              terms: {
                field: 'run.id',
              },
              aggs: {
                type: {
                  terms: {
                    field: 'sample.measurement_type',
                  },
                  aggs: {
                    title: {
                      terms: {
                        field: 'sample.measurement_title.raw',
                      },
                      aggs: {
                        uid: {
                          terms: {
                            field: 'sample.uid',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            name: {
              terms: {
                field: 'run.name',
              },
            },
            controller: {
              terms: {
                field: 'run.controller',
              },
            },
          },
          sort: [
            {
              'iteration.number': {
                order: 'asc',
                unmapped_type: 'boolean',
              },
            },
          ],
        },
      })
    );
  });

  return Promise.all(iterationSampleRequests).then(async iterations => {
    return Promise.all(
      iterations.map(async iteration => {
        iteration = await scrollUntilEmpty(iteration);
      })
    ).then(() => {
      return iterations;
    });
  });
}

export async function queryTimeseriesData(payload) {
  const { selectedDateRange, selectedIterations } = payload;

  const endpoint = `${endpoints.elasticsearch}/${getAllMonthsWithinRange(
    endpoints,
    endpoints.result_data_index,
    selectedDateRange
  )}/_search?scroll=1m`;

  const timeseriesRequests = [];
  Object.entries(selectedIterations).forEach(([runId, run]) => {
    Object.entries(run.iterations).forEach(([, iteration]) => {
      Object.entries(iteration.samples).forEach(([, sample]) => {
        if (sample.benchmark.primary_metric === sample.sample.measurement_title) {
          timeseriesRequests.push(
            request.post(endpoint, {
              params: {
                ignore_unavailable: true,
              },
              data: {
                size: 1000,
                query: {
                  query_string: {
                    query: `run.id:${runId} AND iteration.name:${
                      iteration.name
                    } AND sample.measurement_type:${
                      sample.sample.measurement_type
                    } AND sample.measurement_title:${
                      sample.sample.measurement_title
                    } AND sample.measurement_idx:${sample.sample.measurement_idx} AND sample.name:${
                      sample.sample.name
                    }`,
                    analyze_wildcard: true,
                  },
                },
                sort: [
                  {
                    '@timestamp_original': {
                      order: 'asc',
                      unmapped_type: 'boolean',
                    },
                  },
                ],
              },
            })
          );
        }
      });
    });
  });

  return Promise.all(timeseriesRequests).then(timeseries => {
    return Promise.all(
      timeseries.map(async timeseriesSet => {
        timeseriesSet = await scrollUntilEmpty(timeseriesSet);
      })
    ).then(() => {
      return timeseries;
    });
  });
}
