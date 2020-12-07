import constants from '../config/constants';

// Mocked test index components
const endpoints = {
  prefix: 'test_prefix.',
  run_index: 'test_index.',
};

// Generate controllers as per max page size options
const maxTableSize = parseInt(constants.tableSizeOptions.pop(), 10);
let generatedBuckets = new Array(maxTableSize).fill({});
generatedBuckets = generatedBuckets.map((val, index) => {
  const key = index + 1;
  return {
    key: `controller_${key}`,
    doc_count: key,
    runs_prev1: { value: null },
    runs: { value: key, value_as_string: key.toString() },
  };
});
export const generateMockControllerAggregation = {
  aggregations: {
    controllers: {
      buckets: generatedBuckets,
    },
  },
};

const prefix = endpoints.prefix + endpoints.run_index.slice(0, -1);
export const mockIndices = {
  [`${prefix}.2019-08-01`]: {},
  [`${prefix}.2019-09-01`]: {},
};

export const mockResults = {
  hits: {
    hits: [
      {
        fields: {
          'run.name': ['a_test_run'],
          '@metadata.controller_dir': ['test_run.test_domain.com'],
          'run.start': ['1111-11-11T11:11:11+00:00'],
          'run.id': ['1111'],
          'run.end': ['1111-11-11T11:11:12+00:00'],
          'run.controller': ['test_run.test_domain.com'],
          'run.config': ['test_size_1'],
        },
      },
      {
        fields: {
          'run.name': ['b_test_run'],
          '@metadata.controller_dir': ['b_test_run.test_domain.com'],
          'run.start': ['1111-11-11T11:11:13+00:00'],
          'run.id': ['2222'],
          'run.end': ['1111-11-11T11:11:14+00:00'],
          'run.controller': ['b_test_run.test_domain.com'],
          'run.config': ['test_size_2'],
        },
      },
    ],
  },
};

export const mockMappings = {
  [`${prefix}.2019-09-01`]: {
    mappings: {
      'pbench-run': {
        properties: {
          run: {
            properties: {
              config: { type: 'string', index: 'not_analyzed' },
              name: { type: 'string', index: 'not_analyzed' },
              script: { type: 'string', index: 'not_analyzed' },
              user: { type: 'string', index: 'not_analyzed' },
            },
          },
          '@metadata': {
            properties: {
              controller_dir: { type: 'string', index: 'not_analyzed' },
            },
          },
        },
      },
    },
  },
};

export const mockSearch = {
  hits: {
    total: 1,
    hits: [
      {
        _id: '1111',
        fields: {
          'run.config': ['test-size-1'],
          'run.name': ['test_run'],
          'run.script': ['test_controller'],
          'run.user': ['test_user'],
          '@metadata.controller_dir': ['test_controller'],
        },
      },
    ],
  },
};

export const mockSessionUrl = {
  data: {
    createUrl: {
      id: 'test_id',
    },
  },
};

export const mockDataSample = [
  {
    hits: {
      hits: [
        {
          _source: {
            run: {
              id: 'test_run_id',
              controller: 'test_controller',
              name: 'test_run_name',
              script: 'test_script',
              config: 'test_config',
            },
            iteration: { name: 'test_iteration_1', number: 1 },
            benchmark: {
              instances: 1,
              max_stddevpct: 1,
              message_size_bytes: 1,
              primary_metric: 'test_measurement_title',
              test_type: 'stream',
            },
            sample: {
              closest_sample: 1,
              mean: 0.1,
              stddev: 0.1,
              stddevpct: 1,
              uid: 'test_measurement_id',
              measurement_type: 'test_measurement_type',
              measurement_idx: 0,
              measurement_title: 'test_measurement_title',
              '@idx': 0,
              name: 'sample1',
            },
          },
        },
        {
          _source: {
            run: {
              id: 'test_run_id',
              controller: 'test_controller',
              name: 'test_run_name',
              script: 'test_script',
              config: 'test_config',
            },
            iteration: { name: 'test_iteration_2', number: 2 },
            benchmark: {
              instances: 1,
              max_stddevpct: 1,
              message_size_bytes: 1,
              primary_metric: 'test_measurement_title',
              test_type: 'stream',
            },
            sample: {
              closest_sample: 1,
              mean: 0.1,
              stddev: 0.1,
              stddevpct: 1,
              uid: 'test_measurement_id',
              measurement_type: 'test_measurement_type',
              measurement_idx: 0,
              measurement_title: 'diff_measurement_title',
              '@idx': 1,
              name: 'sample2',
            },
          },
        },
      ],
    },
    aggregations: {
      id: {
        buckets: [
          {
            key: 'test_run_name',
            type: {
              buckets: [
                {
                  key: 'test_measurement_type',
                  title: {
                    buckets: [
                      {
                        key: 'test_measurement_title',
                        uid: {
                          buckets: [
                            {
                              key: 'test_measurement_id',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      name: {
        buckets: [
          {
            key: 'test_run_name',
          },
        ],
      },
      controller: {
        buckets: [
          {
            key: 'test_controller',
          },
        ],
      },
    },
  },
];

export const expectedSampleData = {
  runs: {
    test_run_name: {
      columns: [
        { title: 'Iteration Name', dataIndex: 'name', key: 'name' },
        {
          title: 'test_measurement_type',
          children: [
            {
              title: 'test_measurement_title',
              children: [
                {
                  title: 'test_measurement_type-test_measurement_title-test_measurement_id',
                  children: [
                    {
                      title: 'mean',
                      dataIndex:
                        'test_measurement_type-test_measurement_title-test_measurement_id-mean',
                      key: 'test_measurement_type-test_measurement_title-test_measurement_id-mean',
                    },
                    {
                      title: 'stddevpct',
                      dataIndex:
                        'test_measurement_type-test_measurement_title-test_measurement_id-stddevpct',
                      key:
                        'test_measurement_type-test_measurement_title-test_measurement_id-stddevpct',
                    },
                    {
                      title: 'closest_sample',
                      dataIndex:
                        'test_measurement_type-test_measurement_title-test_measurement_id-closest_sample',
                      key:
                        'test_measurement_type-test_measurement_title-test_measurement_id-closest_sample',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      run_name: 'test_run_name',
      run_controller: 'test_controller',
      iterations: {
        test_iteration_1: {
          name: 'test_iteration_1',
          number: 1,
          closest_sample: 1,
          'test_measurement_type-test_measurement_title-test_measurement_id-closest_sample': 1,
          'test_measurement_type-test_measurement_title-test_measurement_id-mean': 0.1,
          'test_measurement_type-test_measurement_title-test_measurement_id-stddevpct': 1,
          samples: {
            'test_measurement_title-sample1': {
              sample: {
                closest_sample: 1,
                mean: 0.1,
                stddev: 0.1,
                stddevpct: 1,
                uid: 'test_measurement_id',
                measurement_type: 'test_measurement_type',
                measurement_idx: 0,
                measurement_title: 'test_measurement_title',
                '@idx': 0,
                name: 'sample1',
              },
              benchmark: {
                instances: 1,
                max_stddevpct: 1,
                message_size_bytes: 1,
                primary_metric: 'test_measurement_title',
                test_type: 'stream',
              },
              run: {
                id: 'test_run_id',
                controller: 'test_controller',
                name: 'test_run_name',
                script: 'test_script',
                config: 'test_config',
              },
            },
          },
        },
      },
      id: 'test_run_name',
      primaryMetrics: {},
    },
  },
  iterationParams: {
    instances: [1],
    message_size_bytes: [1],
    primary_metric: ['test_measurement_title'],
    test_type: ['stream'],
    closest_sample: [1],
    uid: ['test_measurement_id'],
    measurement_type: ['test_measurement_type'],
    measurement_title: ['test_measurement_title'],
  },
};

export const expectedClusterData = {
  data: {
    test_measurement_title: [
      {
        instances: 1,
        max_stddevpct: 1,
        message_size_bytes: 1,
        primary_metric: 'test_measurement_title',
        test_type: 'stream',
        cluster: {
          test_run_name: 0.1,
          name_test_run_name: 'sample1',
          percent_test_run_name: 1,
          cluster: 1,
        },
        test_run_name: {
          sample: {
            closest_sample: 1,
            mean: 0.1,
            stddev: 0.1,
            stddevpct: 1,
            uid: 'test_measurement_id',
            measurement_type: 'test_measurement_type',
            measurement_idx: 0,
            measurement_title: 'test_measurement_title',
            '@idx': 0,
            name: 'sample1',
          },
          run: {
            id: 'test_run_id',
            controller: 'test_controller',
            name: 'test_run_name',
            script: 'test_script',
            config: 'test_config',
          },
          benchmark: {
            instances: 1,
            max_stddevpct: 1,
            message_size_bytes: 1,
            primary_metric: 'test_measurement_title',
            test_type: 'stream',
          },
        },
      },
    ],
  },
  keys: {},
  params: {},
};
