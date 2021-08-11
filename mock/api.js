import moment from 'moment';
import casual from 'casual';

const DEFAULT_SIZE = 100;

export const mockIndices = new Array(1).fill().map(() => moment().format('YYYY-MM'));

export const mockControllers = new Array(DEFAULT_SIZE).fill().map((value, index) => ({
  controller: `${casual.word}.${casual.word}.com`,
  key: casual.ip,
  last_modified_string: moment().valueOf(moment.utc()),
  last_modified_value: moment.utc() + index,
  results: casual.integer(1, DEFAULT_SIZE),
}));

export const mockResults = hostname =>
  new Array(DEFAULT_SIZE).fill().map(() => ({
    '@metadata.controller_dir': hostname,
    config: casual.word,
    controller: hostname,
    end: moment.utc(),
    // Since dataset id is a long hex string, removed "-" characters here to make it look like real data
    id: casual.uuid.replace(/-/g, ''),
    result: casual.word,
    start: moment.utc(),
  }));

export const mockSamples = {
  _scroll_id: casual.uuid,
  hits: {
    total: DEFAULT_SIZE,
    hits: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
      _source: {
        '@timestamp': moment.utc(),
        run: {
          id: 'test_id',
          controller: 'test_controller',
          name: 'test_result',
          script: casual.random_element(['fio', 'uperf']),
          date: moment.utc() + index,
          start: moment.utc() + index,
          end: moment.utc() + index,
          user: casual.username,
        },
        iteration: {
          name: `iteration${index + 1}`,
          number: index + 1,
        },
        benchmark: {
          max_stddevpct: casual.integer(1, 5),
          primary_metric: casual.random_element(['clat', 'iops_sec']),
          uid: 'benchmark_name:fio-controller_host:test_controller',
          name: casual.random_element(['fio', 'uperf']),
          uid_tmpl: 'benchmark_name:%benchmark_name%-controller_host:%controller_host%',
        },
        sample: {
          client_hostname: casual.random_element(['1', '2']),
          closest_sample: casual.integer(1, 5),
          description: casual.short_description,
          mean: casual.integer(1, DEFAULT_SIZE * 100),
          role: 'client',
          stddev: casual.integer(1, DEFAULT_SIZE * 100),
          stddevpct: casual.integer(1, DEFAULT_SIZE),
          uid: casual.random_element(['client_hostname:1', 'client_hostname:2']),
          measurement_type: casual.random_element(['latency', 'throughput']),
          measurement_idx: casual.integer(0, 4),
          measurement_title: casual.random_element(['clat', 'iops_sec']),
          uid_tmpl: 'client_hostname:%client_hostname%',
          '@idx': casual.integer(0, 4),
          name: `sample${casual.integer(1, 5)}`,
          start: moment.utc() + index,
          end: moment.utc() + index,
        },
      },
    })),
  },
  aggregations: {
    id: {
      buckets: [
        {
          key: 'test_id',
          type: {
            buckets: [
              {
                key: 'latency',
                title: {
                  buckets: [
                    {
                      key: 'clat',
                      uid: {
                        buckets: new Array(2).fill().map((value, index) => ({
                          key: `client_hostname:${index + 1}`,
                        })),
                      },
                    },
                  ],
                },
              },
              {
                key: 'throughput',
                title: {
                  buckets: [
                    {
                      key: 'iops_sec',
                      uid: {
                        buckets: new Array(2).fill().map((value, index) => ({
                          key: `client_hostname:${index + 1}`,
                        })),
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
          key: 'test_result',
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
};

export const mockDetail = hostname => ({
  hostTools: new Array(DEFAULT_SIZE).fill().map(() => ({
    hostname: hostname.split('.')[0],
    'hostname-f': hostname,
    tools: {
      'hostname-alias': '',
      'hostname-all-fqdns': hostname,
      'hostname-all-ip-addresses': casual.ip,
      'hostname-domain': `${casual.word}.${casual.word}.com`,
      'hostname-fqdn': hostname,
      'hostname-ip-address': casual.ip,
      'hostname-nis': 'hostname: Local domain name not set',
      'hostname-short': hostname.split('.')[0],
      'rpm-version': `v0.+${casual.integer}`,
      tools: casual.word,
      vmstat: '',
    },
  })),
  runMetadata: {
    config: casual.word,
    controller: hostname,
    controller_dir: 'gprfc056.sbu.lab.eng.bos.redhat.com',
    date: moment.utc(),
    end: moment.utc(),
    start: moment.utc(),
    'file-date': moment.utc(),
    'file-name': `/${casual.work}/${casual.work}/${casual.work}`,
    'file-size': casual.building_number,
    id: casual.uuid.replace(/-/g, ''),
    iterations: casual.word,
    md5: casual.uuid.replace(/-/g, ''),
    name: casual.word,
    'pbench-agent-version': `v0.+${casual.integer}`,
    raw_size: casual.building_number,
    script: casual.word,
    'tar-ball-creation-timestamp': moment.utc,
    'toc-prefix': casual.word,
    toolsgroup: 'default',
  },
});
export const mockTableContents = {
  hits: {
    total: DEFAULT_SIZE,
    hits: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
      _source: {
        parent: `${casual.word}/${casual.word}/${casual.word}/${casual.word}/${casual.word}/${
          casual.word
        }`,
        directory: `${casual.word}/${casual.word}/${casual.word}/${casual.word}/${casual.word}/${
          casual.word
        }`,
        mtime: moment.utc() + index,
        mode: casual.word,
        name: casual.word,
        ancestor_path_elements: [
          casual.word,
          casual.word,
          casual.word,
          casual.word,
          casual.word,
          casual.word,
        ],
        files: [
          {
            name: casual.uid,
            mtime: moment.utc() + index,
            size: casual.integer(1, DEFAULT_SIZE),
            mode: '0o644',
            type: casual.random_element([
              'reg',
              'areg',
              'lnk',
              'sym',
              'dir',
              'fifo',
              'cont',
              'chr',
              'blk',
              'spr',
            ]),
          },
        ],
      },
    })),
  },
};

export const mockMappings = {
  test_index: {
    mappings: {
      properties: {
        run: {
          properties: {
            config: { type: 'string', index: 'not_analyzed' },
            controller: { type: 'string', index: 'not_analyzed' },
            date: { type: 'date', format: 'dateOptionalTime' },
            end: { type: 'date', format: 'dateOptionalTime' },
            id: { type: 'string', index: 'not_analyzed' },
            iterations: { type: 'string' },
            name: { type: 'string', index: 'not_analyzed' },
            start: { type: 'date', format: 'dateOptionalTime' },
            user: { type: 'string', index: 'not_analyzed' },
          },
        },
      },
    },
  },
};

export const mockTimeseries = {
  // TODO: need to figure out how to mock the series of queries we make
  // in queryTimeseriesData. This doesn't appear to have been mocked before
  // and maybe isn't tested (seems to be used only in the Compare function)
};

export const mockSearch = {
  hits: {
    total: DEFAULT_SIZE,
    hits: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
      _id: index + 1,
      _source: {
        run: {
          config: casual.description,
          name: casual.word,
          script: casual.word,
          user: casual.name,
        },
        '@metadata.controller_dir': casual.word,
      },
    })),
  },
};

export const mockSessions = {
  data: {
    sessions: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
      id: index + 1,
      config: '{}',
      description: casual.description,
      createdAt: casual.date(),
    })),
  },
};

export const mockSession = {
  data: {
    createSession: {
      id: casual.uid,
      config: '{}',
      description: casual.description,
    },
  },
};

export const mockEndpoints = {
  api: {
    controllers_list: '/api/v1/controllers/list',
    controllers_months: '/api/v1/controllers/months',
    datasets_list: '/api/v1/datasets/list',
    datasets_detail: '/api/v1/datasets/detail',

    // NOTE: these are not implemented in the server yet, but are defined
    // below as mocks for testing
    datasets_toc: '/api/v1/datasets/toc',
    datasets_samples: '/api/v1/datasets/samples',
    datasets_timeseries: '/api/v1/datasets/timeseries',
    mappings: '/api/v1/index/mappings',
    search: '/api/v1/index/search',
    // END test-only mock endpoints

    elasticsearch: '/api/v1/elasticsearch',
    endpoints: '/api/v1/endpoints',
    graphql: '/api/v1/graphql',
    host_info: '/api/v1/host_info',
    login: '/api/v1/login',
    logout: '/api/v1/logout',
    register: '/api/v1/register',
    results: '/api/v1/results',
    upload_ctrl: '/api/v1/upload/ctrl/',
    user: '/api/v1/user/',
  },
  identification: 'Pbench MOCK server 0.71.0-xxxxx',
  indices: {
    result_data_index: 'test.v5.result-data.',
    result_index: 'test.v5.result-data-sample.',
    run_index: 'test.v6.run-data.',
    run_toc_index: 'test.v6.run-toc.',
  },
};

export default {
  'GET /api/v1/endpoints': mockEndpoints,
  'GET /api/v1/controllers/months': mockIndices,
  'POST /api/v1/controllers/list': mockControllers,
  'POST /api/v1/datasets/list': (req, res) => {
    const data = {};
    data[req.body.controller] = mockResults(req.body.controller);
    res.send(data);
  },
  'POST /api/v1/datasets/detail': (req, res) => {
    res.send(mockDetail(req.body.name));
  },
  'POST /api/v1/datasets/toc': mockTableContents,
  'POST /api/v1/datasets/samples': mockSamples,
  'POST /api/v1/datasets/timeseries': mockTimeseries,
  'POST /api/v1/index/mappings': mockMappings,
  'POST /api/v1/index/search': mockSearch,
  'POST /sessions/list': mockSessions,
  'POST /sessions/create': mockSession,
};
