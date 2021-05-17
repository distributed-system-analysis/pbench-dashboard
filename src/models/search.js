/* eslint-disable no-underscore-dangle */
import { queryIndexMapping, searchQuery } from '../services/search';

export default {
  namespace: 'search',

  state: {
    mapping: {},
    searchResults: [],
    fields: [],
  },

  effects: {
    *rehydrate({ payload }, { put }) {
      yield put({
        type: 'rehydrateSearch',
        payload,
      });
    },
    *fetchIndexMapping({ payload }, { call, put, all }) {
      try {
        const response = yield call(queryIndexMapping, payload);
        const { indices } = payload;
        const { endpoints } = window;

        // eslint-disable-next-line no-undef
        const index = MOCK_UI ? 'test_index' : endpoints.prefix + endpoints.run_index + indices[0];
        const mapping = response[index].mappings.properties;
        let fields = [];
        const filters = {};

        Object.entries(mapping).forEach(([key, value]) => {
          if (typeof value.properties !== 'undefined') {
            filters[key] = Object.keys(value.properties);
            fields = fields.concat(Object.keys(value.properties));
          }
        });
        yield all([
          yield put({
            type: 'getIndexMapping',
            payload: filters,
          }),
          yield put({
            type: 'getIndexFields',
            payload: fields,
          }),
          yield put({
            type: 'global/modifySelectedFields',
            payload: ['run.name', 'run.config', 'run.controller', '@metadata.controller_dir'],
          }),
        ]);
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
      }
    },
    *fetchSearchResults({ payload }, { call, put }) {
      try {
        const response = yield call(searchQuery, payload);
        const { selectedFields } = payload;

        const searchResults = {};
        searchResults.resultCount = response.hits.total.value;
        const parsedResults = [];

        const getValue = (data, keys) => {
          let value;
          if (typeof data[keys[0]] === 'undefined') {
            value = undefined;
          } else if (keys.length === 1) {
            value = data[keys[0]];
          } else {
            value = getValue(data[keys[0]], keys.slice(1));
          }
          return value;
        };

        response.hits.hits.forEach(result => {
          const parsedResult = {};
          selectedFields.forEach(field => {
            const value = getValue(result._source, field.split('.'));
            if (typeof value !== 'undefined') {
              parsedResult[field] = value;
            }
          });

          /*
          * NOTE: these make the output of searchQuery compatible with the
          * expectations of fetchIterationSamples, as it would normally get
          * from fetchResults
          */
          if (typeof result._id !== 'undefined') {
            parsedResult.id = result._id;
          }
          if (typeof result._source.run.name !== 'undefined') {
            parsedResult.key = result._source.run.name;
          }

          parsedResults.push(parsedResult);
        });

        searchResults.results = parsedResults;

        yield put({
          type: 'getSearchResults',
          payload: searchResults,
        });
      } catch (error) {
        const { data } = error;
        let errortext = 'Something went wrong. Please try again.';
        if (data) {
          const { message } = data;
          errortext = message;
        }
        yield put({
          type: 'error/updateAlertMessage',
          payload: {
            messageType: 'error',
            message: errortext,
          },
        });
      }
    },
  },

  reducers: {
    rehydrateSearch(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getIndexMapping(state, { payload }) {
      return {
        ...state,
        mapping: payload,
      };
    },
    getIndexFields(state, { payload }) {
      return {
        ...state,
        fields: payload,
      };
    },
    getSearchResults(state, { payload }) {
      return {
        ...state,
        searchResults: payload,
      };
    },
  },
};
