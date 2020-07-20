/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import request from '../utils/request';

function parseMonths(datastoreConfig, index, selectedIndices) {
  let indices = '';

  selectedIndices.forEach(value => {
    if (index === datastoreConfig.result_index) {
      indices += `${datastoreConfig.prefix + index + value}-*,`;
    } else {
      indices += `${datastoreConfig.prefix + index + value},`;
    }
  });

  return indices;
}

function scrollUntilEmpty(datastoreConfig, data) {
  const url = `${datastoreConfig.elasticsearch}/_search/scroll?scroll=1m`;
  const endpoint = `${datastoreConfig.test_server}/download`;
  const allData = data;

  if (allData.hits.total !== allData.hits.hits.length) {
    const scroll = request.post(endpoint, {
      data: { url: `${endpoint}&scroll_id=${allData._scroll_id}` },
    });
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
  const { datastoreConfig, selectedIndices } = params;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
      payload: {
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
    },
  });
}

export async function queryResults(params) {
  const { datastoreConfig, selectedIndices, controller } = params;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
      payload: {
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
    },
  });
}

export async function queryResult(params) {
  const { datastoreConfig, selectedIndices, result } = params;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search?source=`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
      payload: {
        query: {
          match: {
            'run.name': result,
          },
        },
        sort: '_index',
      },
    },
  });
}

export async function queryTocResult(params) {
  const { datastoreConfig, selectedIndices, id } = params;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search?q=_parent:"${id}"`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  return request.post(endpoint, {
    data: {
      url,
    },
  });
}

export async function queryIterationSamples(params) {
  const { datastoreConfig, selectedIndices, selectedResults } = params;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.result_index,
    selectedIndices
  )}/_search?scroll=1m`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  const iterationSampleRequests = [];
  selectedResults.forEach(run => {
    iterationSampleRequests.push(
      request.post(endpoint, {
        data: {
          url,
          payload: {
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
  const { datastoreConfig, selectedIndices, selectedIterations } = payload;

  const url = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.result_index,
    selectedIndices
  )}/_search?scroll=1m`;

  const endpoint = `${datastoreConfig.test_server}/download`;

  const timeseriesRequests = [];
  Object.entries(selectedIterations).forEach(([runId, run]) => {
    Object.entries(run.iterations).forEach(([, iteration]) => {
      Object.entries(iteration.samples).forEach(([, sample]) => {
        if (sample.benchmark.primary_metric === sample.sample.measurement_title) {
          timeseriesRequests.push(
            request.post(endpoint, {
              data: {
                url,
                payload: {
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
