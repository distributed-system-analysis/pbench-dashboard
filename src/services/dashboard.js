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

export async function queryControllers(params) {
  const { datastoreConfig, selectedIndices } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search`;

  return request.post(endpoint, {
    data: {
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
}

export async function queryResults(params) {
  const { datastoreConfig, selectedIndices, controller } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search`;

  return request.post(endpoint, {
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
}

export async function queryResult(params) {
  const { datastoreConfig, selectedIndices, result } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.run_index,
    selectedIndices
  )}/_search?source=`;

  return request.post(endpoint, {
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
  const { datastoreConfig, selectedIndices, id } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    selectedIndices
  )}/_search?q=_parent:"${id}"`;

  return request.post(endpoint);
}

export async function queryIterationSamples(params) {
  const { datastoreConfig, selectedIndices, selectedResults } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.result_index,
    selectedIndices
  )}/_search?scroll=1m`;

  const iterationSampleRequests = [];
  selectedResults.forEach(run => {
    iterationSampleRequests.push(
      request.post(endpoint, {
        data: {
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
          size: 10000,
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

  return Promise.all(iterationSampleRequests).then(iterations => {
    return iterations;
  });
}

export async function queryTimeseriesData(params) {
  const { datastoreConfig, selectedIndices, selectedResults } = params;

  const endpoint = `${datastoreConfig.elasticsearch}/${parseMonths(
    datastoreConfig,
    datastoreConfig.result_index,
    selectedIndices
  )}/_search?scroll=1m`;

  const iterationSampleRequests = [];
  selectedResults.forEach(run => {
    iterationSampleRequests.push(
      request.post(endpoint, {
        data: {
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
                  _type: 'pbench-result-data',
                },
              },
            },
          },
          size: 10000,
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
  });

  return Promise.all(iterationSampleRequests).then(iterations => {
    return iterations;
  });
}

export async function queryIterations(params) {
  const { datastoreConfig, selectedResults } = params;

  const iterationRequests = [];
  selectedResults.forEach(result => {
    let controllerDir = result['@metadata.controller_dir'];
    if (controllerDir === undefined) {
      controllerDir = result['run.controller'];
      controllerDir = controllerDir.includes('.')
        ? controllerDir.slice(0, controllerDir.indexOf('.'))
        : controllerDir;
    }
    iterationRequests.push(
      request.get(
        `${datastoreConfig.results}/incoming/${encodeURI(controllerDir)}/${encodeURI(
          result['run.name']
        )}/result.json`,
        { getResponse: true }
      )
    );
  });

  return Promise.all(iterationRequests).then(response => {
    const iterations = [];
    response.forEach((iteration, index) => {
      iterations.push({
        iterationData: iteration.data,
        controllerName: iteration.response.url.split('/')[4],
        resultName: iteration.response.url.split('/')[5],
        tableId: index,
      });
    });
    return iterations;
  });
}
