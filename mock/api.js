import moment from 'moment';
import casual from 'casual';

const DEFAULT_SIZE = 100;

export const mockIndices = new Array(DEFAULT_SIZE).fill().map(() => moment().format('YYYY-MM'));

export const mockControllers = new Array(DEFAULT_SIZE).fill().map((value, index) => ({
  controller: casual.word,
  key: casual.word,
  last_modified_string: moment.utc() + index,
  last_modified_value: moment.utc() + index,
  results: casual.integer(1, DEFAULT_SIZE),
}));

export const mockResults = {
  took: DEFAULT_SIZE,
  hits: {
    total: {
      value: DEFAULT_SIZE,
    },
    hits: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
      _index: moment().format('YYYY-MM'),
      _type: casual.word,
      _id: casual.uuid,
      _score: null,
      _source: {
        '@metadata': {
          controller_dir: casual.word,
        },
        run: {
          controller: casual.word,
          name: casual.word,
          start: moment.utc() + index,
          end: moment.utc() + index,
          id: casual.uuid,
          config: casual.word,
        },
      },
      sort: [casual.unix_time],
    })),
  },
};

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

export const mockDetail = {
  hits: {
    hits: [
      {
        _source: {
          run: {
            id: 'test_id',
            controller: 'test_controller',
            name: 'test_result',
            script: casual.random_element(['fio', 'uperf']),
            date: moment.utc(),
            start: moment.utc(),
            end: moment.utc(),
            user: casual.username,
          },
          host_tools_info: [
            {
              hostname: 'test_host',
              tools: {
                iostat: '--interval=3',
                mpstat: '--interval=3',
                perf: "--record-opts='record -a --freq=100'",
                pidstat: '--interval=30',
                'proc-interrupts': '--interval=3',
                'proc-vmstat': '--interval=3',
                sar: '--interval=3',
                turbostat: '--interval=3',
              },
            },
          ],
        },
      },
    ],
  },
};

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
    urls: new Array(DEFAULT_SIZE).fill().map((value, index) => ({
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

export default {
  'GET /controllers/months': mockIndices,
  'POST /controllers/list': mockControllers,
  'POST /datasets/list': mockResults,
  'POST /datasets/detail': mockDetail,
  'POST /datasets/toc': mockTableContents,
  'POST /datasets/samples': mockSamples,
  'POST /mappings': mockMappings,
  'POST /search': mockSearch,
  'POST /sessions/list': mockSessions,
  'POST /sessions/create': mockSession,
};
