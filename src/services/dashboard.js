/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { notification } from 'antd';
import request, { codeMessage } from '../utils/request';
import { getAllMonthsWithinRange } from '../utils/moment_constants';

async function scrollUntilEmpty(datastoreConfig, data) {
  const endpoint = `${datastoreConfig.elasticsearch}/_search/scroll?scroll=1m`;
  const allData = data;
  if (allData.hits.total !== allData.hits.hits.length) {
    const scroll = Promise.resolve(
      request.post(`${endpoint}&scroll_id=${allData._scroll_id}`, {
        errorHandler: error => {
          // override default errorhandler
          // at @/utils/request.js.
          // does not break the page on a 502 response,
          // but throws the error with a notification
          // so that the dashboard can function normally.
          const { response = {} } = error;
          const errortext = codeMessage[response.status] || response.statusText;
          const { status } = response;

          notification.error({
            message: `Request Error ${status}`,
            description: errortext,
          });

          throw error;
        },
      })
    );
    scroll.then(response => {
      allData._scroll_id = response._scroll_id;
      allData.hits.total = response.hits.total;
      allData.hits.hits = [...allData.hits.hits, ...response.hits.hits];
      return scrollUntilEmpty(datastoreConfig, allData);
    });
  }

  return allData;
}

export async function queryControllers(params) {
  try {
    const { datastoreConfig, selectedDateRange } = params;

    const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
      datastoreConfig,
      datastoreConfig.run_index,
      selectedDateRange
    )}/_search`;

    return request.post(endpoint, {
      params: {
        ignore_unavailable: true,
      },
      data: {
        filter: {
          range: {
            '@timestamp': {
              gte: selectedDateRange.start,
              lte: selectedDateRange.end,
            },
          },
        },
        aggs: {
          controllers: {
            terms: {
              field: 'controller',
              size: 0,
              order: [{ runs: 'desc' }, { runs_preV1: 'desc' }],
            },
            aggs: {
              runs_preV1: {
                max: {
                  field: 'run.start_run',
                },
              },
              runs: {
                max: {
                  field: 'run.start',
                },
              },
            },
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function queryResults(params) {
  try {
    const { datastoreConfig, selectedDateRange, controller } = params;

    const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
      datastoreConfig,
      datastoreConfig.run_index,
      selectedDateRange
    )}/_search`;

    return request.post(endpoint, {
      params: {
        ignore_unavailable: true,
      },
      data: {
        fields: [
          '@metadata.controller_dir',
          '@metadata.satellite',
          'run.controller',
          'run.start',
          'run.start_run', // For pre-v1 run mapping version
          'run.end',
          'run.end_run', // For pre-v1 run mapping version
          'run.name',
          'run.config',
          'run.prefix',
          'run.id',
        ],
        sort: {
          'run.end': {
            order: 'desc',
            ignore_unmapped: true,
          },
        },
        query: {
          term: {
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
  const { datastoreConfig, selectedDateRange, result } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedDateRange
  )}/_search?source=`;

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
  const { datastoreConfig, selectedDateRange, id } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedDateRange
  )}/_search?q=_parent:"${id}"`;

  return request.post(endpoint, {
    params: {
      ignore_unavailable: true,
    },
  });
}

export async function queryIterationSamples(params) {
  const { datastoreConfig, selectedDateRange, selectedResults } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
    datastoreConfig,
    datastoreConfig.result_index,
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
            filtered: {
              query: {
                multi_match: {
                  query: run.id,
                  fields: ['run.id'],
                },
              },
              filter: {
                term: {
                  _type: 'pbench-result-data-sample',
                },
              },
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
                        field: 'sample.measurement_title',
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
        iteration = await scrollUntilEmpty(datastoreConfig, iteration);
      })
    ).then(() => {
      return iterations;
    });
  });
}

export async function queryTimeseriesData(payload) {
  const { datastoreConfig, selectedDateRange, selectedIterations } = payload;

  const endpoint = `${datastoreConfig.elasticsearch}/${getAllMonthsWithinRange(
    datastoreConfig,
    datastoreConfig.result_index,
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
                  filtered: {
                    query: {
                      query_string: {
                        query: `_type:pbench-result-data AND run.id:${runId} AND iteration.name:${
                          iteration.name
                        } AND sample.measurement_type:${
                          sample.sample.measurement_type
                        } AND sample.measurement_title:${
                          sample.sample.measurement_title
                        } AND sample.measurement_idx:${
                          sample.sample.measurement_idx
                        } AND sample.name:${sample.sample.name}`,
                        analyze_wildcard: true,
                      },
                    },
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
        timeseriesSet = await scrollUntilEmpty(datastoreConfig, timeseriesSet);
      })
    ).then(() => {
      return timeseries;
    });
  });
}
