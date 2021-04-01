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
  const params = new Set();
  const runNames = new Set();

  Object.entries(results).forEach(([runId, result]) => {
    Object.entries(result.iterations).forEach(([, iteration]) => {
      runNames.add(result.run_name);
      Object.entries(iteration.samples).forEach(([sampleId, sample]) => {
        if (
          sample.sample.measurement_title !== sample.benchmark.primary_metric ||
          sample.sample.closest_sample !== sample.sample['@idx'] + 1
        ) {
          return;
        }

        Object.keys(sample.benchmark).forEach(param => params.add(param));
        const paramKey = Object.values(sample.benchmark).join('-');
        const primaryMetric = sampleId.split('-')[0];
        const clusterId = `${runId}_${iteration.name}_${sample.sample.name}`;

        if (primaryMetric === sample.benchmark.primary_metric.toLowerCase()) {
          iterations[paramKey] = {
            ...iterations[paramKey],
            ...sample.benchmark,
            clusterKeys: {
              ...(iterations[paramKey] !== undefined && iterations[paramKey].clusterKeys),
              [clusterId]: null,
            },
            iterations: {
              ...(iterations[paramKey] !== undefined && iterations[paramKey].iterations),
              [iteration.name]: sample.sample.name,
            },
            runIds: {
              ...(iterations[paramKey] !== undefined && iterations[paramKey].runIds),
              [runId]: sample.run.name,
            },
            cluster: {
              ...(iterations[paramKey] !== undefined && iterations[paramKey].cluster),
              [clusterId]: {
                y: sample.sample.mean,
                key: paramKey,
                iteration_name: iteration.name,
                run_name: sample.run.name,
              },
            },
            [clusterId]: {
              sample: sample.sample,
              run: sample.run,
              benchmark: sample.benchmark,
            },
          };
        }
      });
    });
  });

  const clusters = _.groupBy(Object.values(iterations), 'primary_metric');
  const clusterKeys = new Set();
  Object.entries(clusters).forEach(([, primaryMetricCluster]) => {
    Object.entries(primaryMetricCluster).forEach(([index, cluster]) => {
      const clusterId = (parseInt(index, 10) + 1).toString();
      clusterKeys.add(clusterId);
      Object.entries(cluster.cluster).forEach(([, clusterKey]) => {
        // eslint-disable-next-line no-param-reassign
        clusterKey.x = clusterId;
      });
    });
  });

  const legendData = [];
  runNames.forEach(key => {
    legendData.push({
      name: key,
    });
  });

  return {
    data: clusters,
    paramKeys: legendData,
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
    const primaryMetrics = new Set();

    if (run.hits.hits.length === 0) {
      return;
    }

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
          ...(sampleFields.role === 'aggregate' && {
            [`${primaryMetric}-${sampleFields.name}`]: {
              sample: { ...sampleFields },
              benchmark: _.omit({ ...benchmarkFields }, benchmarkBlacklist),
              run: { ...runFields },
            },
          }),
        },
      };
    });

    const id = run.aggregations.id.buckets[0].key;

    run.aggregations.id.buckets.forEach(runId => {
      const iterationColumnsData = [
        {
          Header: 'Iteration Name',
          accessor: 'name',
        },
      ];
      runId.type.buckets.forEach(type => {
        iterationColumnsData.push({
          Header: type.key,
          columns: type.title.buckets.map(title => {
            return {
              Header: title.key,
              columns: title.uid.buckets.map(uid => {
                return {
                  Header: uid.key,
                  columns: [
                    {
                      Header: 'mean',
                      accessor: `${type.key}-${title.key}-${uid.key}-mean`,
                      key: `${type.key}-${title.key}-${uid.key}-mean`,
                    },
                    {
                      Header: 'stddevpct',
                      accessor: `${type.key}-${title.key}-${uid.key}-stddevpct`,
                      key: `${type.key}-${title.key}-${uid.key}-stddevpct`,
                    },
                    {
                      Header: 'closest_sample',
                      accessor: `${type.key}-${title.key}-${uid.key}-closest_sample`,
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
