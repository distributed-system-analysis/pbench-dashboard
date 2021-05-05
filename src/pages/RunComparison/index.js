import React from 'react';
import { connect } from 'dva';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  ListVariant,
  Spinner,
} from '@patternfly/react-core';
import {
  Chart,
  ChartBar,
  ChartAxis,
  ChartGroup,
  ChartVoronoiContainer,
  ChartThemeColor,
} from '@patternfly/react-charts';
import TimeseriesGraph from '@/components/TimeseriesGraph';
import { generateClusters } from '../../utils/parse';

@connect(({ dashboard, global }) => ({
  iterationParams: dashboard.iterationParams,
  selectedControllers: global.selectedControllers,
  selectedResults: global.selectedResults,
  selectedDateRange: global.selectedDateRange,
  selectedIterations: global.selectedIterations,
}))
class RunComparison extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clusters: {},
      paramKeys: [],
      loadingClusters: false,
    };
  }

  componentDidMount() {
    const { iterationParams, selectedIterations, selectedDateRange, dispatch } = this.props;

    this.setState({ loadingClusters: true });
    const clusters = generateClusters(selectedIterations, iterationParams);
    this.setState({ paramKeys: clusters.paramKeys });

    dispatch({
      type: 'dashboard/fetchTimeseriesData',
      payload: { selectedDateRange, selectedIterations, clusters },
    }).then(timeseriesClusters => {
      this.setState({
        clusters: timeseriesClusters,
      });
      this.setState({
        loadingClusters: false,
      });
    });
  }

  render() {
    const { clusters, paramKeys, loadingClusters } = this.state;

    return (
      <React.Fragment>
        <Page>
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Run Comparison</Text>
              <List variant={ListVariant.inline}>
                {paramKeys.map(run => (
                  <ListItem>{run.name}</ListItem>
                ))}
              </List>
            </TextContent>
          </PageSection>
          <PageSection>
            <Card>
              <CardHeader>Summary</CardHeader>
              {loadingClusters ? (
                <Spinner
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                />
              ) : (
                <CardBody>
                  {Object.keys(clusters).map(cluster => (
                    <div style={{ height: '400px', width: '1000px' }}>
                      <Chart
                        containerComponent={
                          <ChartVoronoiContainer
                            labels={({ datum }) => `${datum.iteration_name}: ${datum.y}`}
                            constrainToVisibleArea
                          />
                        }
                        fixLabelOverlap
                        legendData={paramKeys}
                        legendOrientation="vertical"
                        legendPosition="bottom"
                        height={400}
                        themeColor={ChartThemeColor.multiOrdered}
                        width={1000}
                        padding={{
                          bottom: 150,
                          left: 100,
                          right: 300,
                          top: 50,
                        }}
                      >
                        <ChartAxis label="Clusters" />
                        <ChartAxis label="Sample Mean" dependentAxis showGrid />
                        {clusters[cluster].map(iteration => iteration.cluster).map(clusterData => (
                          <ChartGroup offset={20}>
                            {Object.entries(clusterData)
                              .map(entry => entry[1])
                              .map(clusterItem => (
                                <ChartBar data={[clusterItem]} />
                              ))}
                          </ChartGroup>
                        ))}
                      </Chart>
                    </div>
                  ))}
                </CardBody>
              )}
            </Card>
          </PageSection>
          <PageSection>
            {Object.keys(clusters).map(primaryMetric => (
              <Card>
                <CardHeader>{primaryMetric}</CardHeader>
                {loadingClusters ? (
                  <Spinner
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  />
                ) : (
                  <CardBody>
                    <TimeseriesGraph
                      key={primaryMetric}
                      graphId={primaryMetric}
                      graphName={primaryMetric}
                      data={clusters[primaryMetric]}
                      dataSeriesNames={clusters[primaryMetric]}
                      options={Object.keys(clusters[primaryMetric])}
                      xAxisSeries="time"
                    />
                  </CardBody>
                )}
              </Card>
            ))}
          </PageSection>
        </Page>
      </React.Fragment>
    );
  }
}

export default RunComparison;
