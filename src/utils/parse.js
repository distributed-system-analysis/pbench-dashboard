import _ from 'lodash';

export const filterIterations = (results, selectedParams) => {
  const resultsCopy = _.cloneDeep(results);

  Object.entries(resultsCopy).forEach(([runId, result]) => {
    Object.entries(result.iterations).forEach(([iterationId, iteration]) => {
      Object.entries(iteration.samples).forEach(([, sample]) => {
        const match =
          _.isMatch(sample.sample, selectedParams) || _.isMatch(sample.benchmark, selectedParams);
        if (match === false) {
          delete resultsCopy[runId].iterations[iterationId];
        }
      });
    });
  });

  return resultsCopy;
};

export const generateClusters = results => {
  const iterations = {};
  const clusterGraphKeys = new Set();
  const params = new Set();

  Object.entries(results).forEach(([runId, result]) => {
    Object.entries(result.iterations).forEach(([, iteration]) => {
      Object.entries(iteration.samples).forEach(([sampleId, sample]) => {
        Object.keys(sample.benchmark).forEach(param => params.add(param));
        const paramKey = Object.values(sample.benchmark).join('-');
        const primaryMetric = sampleId.split('-')[0];

        if (primaryMetric === sample.benchmark.primary_metric.toLowerCase()) {
          iterations[paramKey] = {
            ...iterations[paramKey],
            ...sample.benchmark,
            cluster: {
              ...(iterations[paramKey] !== undefined && iterations[paramKey].cluster),
              [`${runId}`]: sample.sample.mean,
              [`name_${runId}`]: sample.sample.name,
              [`percent_${runId}`]: sample.sample.stddevpct,
              cluster: paramKey,
            },
            [runId]: {
              sample: sample.sample,
              run: sample.run,
              benchmark: sample.benchmark,
            },
          };
          clusterGraphKeys.add(`${runId}`);
        }
      });
    });
  });

  const clusters = _.groupBy(Object.values(iterations), 'primary_metric');
  Object.entries(clusters).forEach(([, cluster]) => {
    Object.entries(cluster).forEach(([clusterId, data]) => {
      // eslint-disable-next-line no-param-reassign
      data.cluster.cluster = Number.parseInt(clusterId, 10) + 1;
    });
  });

  return {
    data: clusters,
    keys: clusterGraphKeys,
    params,
  };
};

export const generateSampleTable = response => {
  const runs = {};
  let iterationParams = {};
  const paramBlacklist = [
    '@idx',
    'description',
    'end',
    'max_stddevpct',
    'mean',
    'measurement_idx',
    'name',
    'start',
    'stddev',
    'stddevpct',
    'uid_tmpl',
  ];

  const benchmarkBlacklist = ['clients', 'servers', 'uid', 'version', 'uid_tmpl'];

  response.forEach(run => {
    const iterations = {};
    const id = run.aggregations.id.buckets[0].key;
    const primaryMetrics = new Set();
    run.hits.hits.forEach(sample => {
      // eslint-disable-next-line no-underscore-dangle
      const source = sample._source;
      if (source.iteration.name.includes('fail')) {
        return;
      }
      const sampleSource = _.omit({ ...source.benchmark, ...source.sample }, paramBlacklist);

      // Aggregate iteration params
      iterationParams = _.mergeWith(iterationParams, sampleSource, (objVal, srcVal) => {
        if (objVal !== undefined) {
          const uniqParams = _.uniq([...objVal, ...[srcVal]]);
          return uniqParams;
        }
        return [srcVal];
      });

      // Aggregate iteration samples
      const sampleData = {};
      const sampleFields = source.sample;
      const benchmarkFields = source.benchmark;
      const runFields = source.run;
      const iterationFields = source.iteration;

      const primaryMetric = `${sampleFields.measurement_title}`.toLowerCase();
      const measurementField = `${sampleFields.measurement_type}-${primaryMetric}`.toLowerCase();
      primaryMetrics.add(primaryMetric);
      const samplePrefix = [measurementField, sampleFields.uid].join('-').toLowerCase();

      sampleData[`${samplePrefix}-closest_sample`] = sampleFields.closest_sample;
      sampleData[`${samplePrefix}-mean`] = sampleFields.mean;
      sampleData[`${samplePrefix}-stddevpct`] = sampleFields.stddevpct;
      iterationFields.closest_sample = sampleFields.closest_sample;

      iterations[source.iteration.name] = {
        ...iterations[source.iteration.name],
        ...iterationFields,
        ...sampleData,
        samples: {
          ...(iterations[source.iteration.name] !== undefined &&
            iterations[source.iteration.name].samples),
          ...(sampleFields.closest_sample === sampleFields['@idx'] + 1 && {
            [`${primaryMetric}-${sampleFields.name}`]: {
              sample: { ...sampleFields },
              benchmark: _.omit({ ...benchmarkFields }, benchmarkBlacklist),
              run: { ...runFields },
            },
          }),
        },
      };
    });

    run.aggregations.id.buckets.forEach(runId => {
      const iterationColumnsData = [
        {
          title: 'Iteration Name',
          dataIndex: 'name',
          key: 'name',
        },
      ];
      runId.type.buckets.forEach(type => {
        iterationColumnsData.push({
          title: type.key,
          children: type.title.buckets.map(title => {
            return {
              title: title.key,
              children: title.uid.buckets.map(uid => {
                return {
                  title: `${type.key}-${title.key}-${uid.key}`,
                  children: [
                    {
                      title: 'mean',
                      dataIndex: `${type.key}-${title.key}-${uid.key}-mean`,
                      key: `${type.key}-${title.key}-${uid.key}-mean`,
                    },
                    {
                      title: 'stddevpct',
                      dataIndex: `${type.key}-${title.key}-${uid.key}-stddevpct`,
                      key: `${type.key}-${title.key}-${uid.key}-stddevpct`,
                    },
                    {
                      title: 'closest_sample',
                      dataIndex: `${type.key}-${title.key}-${uid.key}-closest_sample`,
                      key: `${type.key}-${title.key}-${uid.key}-closest_sample`,
                    },
                  ],
                };
              }),
            };
          }),
        });
      });
      runs[runId.key] = { columns: iterationColumnsData };
    });
    runs[id] = {
      ...runs[id],
      run_name: run.aggregations.name.buckets[0].key,
      run_controller: run.aggregations.controller.buckets[0].key,
      iterations,
      id,
      primaryMetrics,
    };
  });
  return {
    runs,
    iterationParams,
  };
};