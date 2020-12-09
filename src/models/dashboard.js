/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import {
  queryControllers,
  queryResults,
  queryResult,
  queryTocResult,
  queryIterationSamples,
  queryTimeseriesData,
} from '../services/dashboard';

import { insertTocTreeData } from '../utils/utils';
import { generateSampleTable } from '../utils/parse';

export default {
  namespace: 'dashboard',

  state: {
    result: [],
    results: {},
    iterationParams: {},
    iterations: [],
    controllers: [],
    tocResult: [],
    loading: false,
    clusters: {},
  },

  effects: {
    *rehydrate({ payload }, { put }) {
      yield put({
        type: 'rehydrateDashboard',
        payload,
      });
    },
    *fetchControllers({ payload }, { call, put }) {
      const controllers = yield call(queryControllers, payload);

      yield put({
        type: 'getControllers',
        payload: controllers,
      });
    },
    *fetchResults({ payload }, { call, put }) {
      const response = yield call(queryResults, payload);
      const runs = [];

      response.hits.hits.forEach(result => {
        const { _source } = result;
        const { run } = _source;
        const { name, controller, id, start, end } = run;
        const metadata = _source['@metadata'];

        const record = {
          key: name,
          startUnixTimestamp: Date.parse(start),
          'run.name': name,
          'run.controller': controller,
          'run.start': start,
          'run.end': end,
          id,
        };

        if (typeof run.config !== 'undefined') {
          record['run.config'] = run.config;
        }
        if (typeof run.prefix !== 'undefined') {
          record['run.prefix'] = run.prefix;
        }
        if (typeof metadata !== 'undefined') {
          if (typeof metadata.controller_dir !== 'undefined') {
            record['@metadata.controller_dir'] = metadata.controller_dir;
          }
          if (typeof metadata.satellite !== 'undefined') {
            record['@metadata.satellite'] = metadata.satellite;
          }
        }
        runs.push(record);
      });

      const results = {};
      results[payload.controller[0]] = runs;

      yield put({
        type: 'getResults',
        payload: results,
      });
    },
    *fetchResult({ payload }, { call, put }) {
      const response = yield call(queryResult, payload);
      const result =
        // eslint-disable-next-line no-underscore-dangle
        typeof response.hits.hits[0] !== 'undefined' ? response.hits.hits[0]._source : [];
      let metadataTag = '';
      const parsedResult = {};

      if (typeof result['@metadata'] !== 'undefined') {
        metadataTag = '@metadata';
      } else {
        metadataTag = '_metadata';
      }

      parsedResult.runMetadata = {
        ...result.run,
        ...result[metadataTag],
      };

      parsedResult.hostTools = [];
      result.host_tools_info.forEach(toolData => {
        parsedResult.hostTools.push(toolData);
      });

      yield put({
        type: 'getResult',
        payload: parsedResult,
      });
    },
    *fetchTocResult({ payload }, { call, put }) {
      const response = yield call(queryTocResult, payload);
      const tocResult = [];
      const extension = [];
      const fileNames = [];
      response.hits.hits.map(result => {
        // eslint-disable-next-line no-underscore-dangle
        const source = result._source;
        if (source.files !== undefined) {
          source.files.map(path => {
            fileNames.push(path);
            const ext = path.name.split('.');
            if (!extension.includes(ext[ext.length - 1])) {
              extension.push(ext[ext.length - 1]);
            }
            if (source.directory === '/') {
              source.directory = '/';
            }
            const url = `${source.directory}/${path.name}`;
            tocResult[url] = [path.size, path.mode, url];
            return tocResult;
          });
        }
        return tocResult;
      });
      // eslint-disable-next-line
      const reg = /\/[^\/]*/gm;
      const tocTree = Object.keys(tocResult)
        .map(path => path.match(reg))
        .reduce((items, path) => insertTocTreeData(tocResult, items, path), []);

      const summaryTocResult = {
        tocResult: tocTree,
        extension,
        fileNames,
      };
      yield put({
        type: 'getTocResult',
        payload: summaryTocResult,
      });
    },
    *fetchIterationSamples({ payload }, { call, put }) {
      const response = yield call(queryIterationSamples, payload);
      const parsedSampleData = generateSampleTable(response);

      yield put({
        type: 'modifyConfigCategories',
        payload: parsedSampleData.iterationParams,
      });
      yield put({
        type: 'getIterations',
        payload: parsedSampleData.runs,
      });
    },
    *fetchTimeseriesData({ payload }, { call }) {
      const response = yield call(queryTimeseriesData, payload);
      const clusteredIterations = payload.clusters.data;

      response.forEach(timeseriesResponse => {
        const timeseriesCollection = [];
        const firstResponse = timeseriesResponse.hits.hits[0]._source;
        const runId = firstResponse.run.id;
        const primaryMetric = firstResponse.sample.measurement_title;
        const iterationName = firstResponse.iteration.name;
        const sampleName = firstResponse.sample.name;
        timeseriesResponse.hits.hits.forEach(timeseries => {
          timeseriesCollection.push({
            x: timeseries._source['@timestamp_original'],
            [`y-${runId}_${iterationName}_${sampleName}`]: timeseries._source.result.value,
          });
        });

        Object.entries(clusteredIterations[primaryMetric]).forEach(([clusterId, cluster]) => {
          const clusterKey = `${runId}_${iterationName}_${sampleName}`;
          if (clusterKey in cluster) {
            clusteredIterations[primaryMetric][clusterId][
              clusterKey
            ].timeseries = timeseriesCollection;
          }
        });
      });

      Object.entries(clusteredIterations).forEach(([primaryMetric, clusters]) => {
        Object.entries(clusters).forEach(([clusterKey, cluster]) => {
          let timeseriesAggregation = {};
          const timeseriesLabels = ['time'];
          Object.entries(cluster.clusterKeys).forEach(([keyIndex]) => {
            timeseriesAggregation =
              Object.keys(timeseriesAggregation).length > 0
                ? (timeseriesAggregation = _.merge(
                    timeseriesAggregation,
                    clusteredIterations[primaryMetric][clusterKey][keyIndex].timeseries
                  ))
                : clusteredIterations[primaryMetric][clusterKey][keyIndex].timeseries;
            timeseriesLabels.push(keyIndex);
          });
          timeseriesAggregation = timeseriesAggregation.map(item => Object.values(item));
          clusteredIterations[primaryMetric][
            clusterKey
          ].timeseriesAggregation = timeseriesAggregation;
          clusteredIterations[primaryMetric][clusterKey].timeseriesLabels = timeseriesLabels;
        });
      });

      return clusteredIterations;
    },
    *updateConfigCategories({ payload }, { put }) {
      yield put({
        type: 'modifyConfigCategories',
        payload,
      });
    },
  },

  reducers: {
    rehydrateDashboard(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getControllers(state, { payload }) {
      return {
        ...state,
        controllers: payload,
      };
    },
    getResults(state, { payload }) {
      return {
        ...state,
        results: { ...state.results, ...payload },
      };
    },
    getResult(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
    getTocResult(state, { payload }) {
      return {
        ...state,
        tocResult: payload,
      };
    },
    getIterations(state, { payload }) {
      return {
        ...state,
        iterations: payload,
      };
    },
    modifySelectedControllers(state, { payload }) {
      return {
        ...state,
        selectedControllers: payload,
      };
    },
    modifySelectedResults(state, { payload }) {
      return {
        ...state,
        selectedResults: payload,
      };
    },
    modifyConfigCategories(state, { payload }) {
      return {
        ...state,
        iterationParams: payload,
      };
    },
  },
};
