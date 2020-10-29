import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import {
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  Card,
  CardBody,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
} from '@patternfly/react-core';
import Table from '@/components/Table';
import TableFilterSelection from '@/components/TableFilterSelection';
import { filterIterations } from '../../utils/parse';

const tocColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '60%',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    width: '20%',
  },
  {
    title: 'Mode',
    dataIndex: 'mode',
    key: 'mode',
  },
];

@connect(({ global, dashboard, loading }) => ({
  iterations: dashboard.iterations,
  iterationParams: dashboard.iterationParams,
  result: dashboard.result,
  tocResult: dashboard.tocResult,
  selectedControllers: global.selectedControllers,
  selectedResults: global.selectedResults,
  selectedDateRange: global.selectedDateRange,
  loadingSummary:
    loading.effects['dashboard/fetchIterationSamples'] ||
    loading.effects['dashboard/fetchResult'] ||
    loading.effects['dashboard/fetchTocResult'],
}))
class Summary extends React.Component {
  constructor(props) {
    super(props);
    const { iterations } = props;

    this.state = {
      activeTabKey: 0,
      resultIterations: iterations,
    };
  }

  componentDidMount() {
    const { dispatch, selectedDateRange, selectedResults } = this.props;

    dispatch({
      type: 'dashboard/fetchIterationSamples',
      payload: { selectedResults, selectedDateRange },
    });
    dispatch({
      type: 'dashboard/fetchResult',
      payload: {
        selectedDateRange,
        result: selectedResults[0]['run.name'],
        parent: '',
      },
    });
    dispatch({
      type: 'dashboard/fetchTocResult',
      payload: {
        selectedDateRange,
        id: selectedResults[0].id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { iterations } = this.props;

    if (nextProps.iterations !== iterations) {
      this.setState({ resultIterations: nextProps.iterations });
    }
  }

  onFilterTable = (selectedParams, selectedPorts) => {
    const { iterations } = this.props;

    const filteredIterations = filterIterations(iterations, selectedParams, selectedPorts);
    this.setState({ resultIterations: filteredIterations });
  };

  onTabChange = (event, tabIndex) => {
    this.setState({ activeTabKey: tabIndex });
  };

  getMoreToCResult = name => {
    const { dispatch, datastoreConfig, selectedDateRange, selectedResults } = this.props;
    console.log(this.props);
    console.log(name);
    dispatch({
      type: 'dashboard/fetchTocResult',
      payload: {
        datastoreConfig,
        selectedDateRange,
        id: selectedResults[0].id,
        parent: name,
      },
    });
  };

  render() {
    const { activeTabKey, resultIterations } = this.state;
    const { loadingSummary, iterationParams, selectedControllers, tocResult, result } = this.props;

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{selectedControllers.join(', ')}</Text>
          </TextContent>
        </PageSection>
        <PageSection padding="noPadding" isFilled>
          <Tabs
            activeKey={activeTabKey}
            onSelect={this.onTabChange}
            style={{ background: '#FFF', marginBottom: 16 }}
          >
            <Tab eventKey={0} title={<TabTitleText>Iterations</TabTitleText>}>
              <Card>
                <CardBody>
                  <Spin spinning={loadingSummary} tip="Loading Iterations...">
                    <TableFilterSelection
                      onFilterTable={this.onFilterTable}
                      filters={iterationParams}
                    />
                    <Table
                      style={{ marginTop: 16 }}
                      columns={
                        resultIterations[Object.keys(resultIterations)[0]] &&
                        resultIterations[Object.keys(resultIterations)[0]].columns
                      }
                      dataSource={
                        resultIterations[Object.keys(resultIterations)[0]] &&
                        Object.values(resultIterations[Object.keys(resultIterations)[0]].iterations)
                      }
                      bordered
                    />
                  </Spin>
                </CardBody>
              </Card>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Table of Contents</TabTitleText>}>
              <Card>
                <CardBody>
                  <Table
                    columns={tocColumns}
                    dataSource={tocResult.tocResult}
                    onRow={r => ({
                      onClick: () => this.getMoreToCResult(`/${r.name}`),
                    })}
                    defaultExpandAllRows
                  />
                </CardBody>
              </Card>
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>Metadata</TabTitleText>}>
              <Card>
                <CardBody>
                  {result.runMetadata && (
                    <DataList aria-label="Simple data list example">
                      {Object.entries(result.runMetadata).map(([label, value]) => (
                        <DataListItem aria-labelledby="simple-item1">
                          <DataListItemRow>
                            <DataListItemCells
                              dataListCells={[
                                <DataListCell key="primary content">
                                  <span id="simple-item1">{label}</span>
                                </DataListCell>,
                                <DataListCell key="secondary content">{value}</DataListCell>,
                              ]}
                            />
                          </DataListItemRow>
                        </DataListItem>
                      ))}
                    </DataList>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab eventKey={3} title={<TabTitleText>Tools & Parameters</TabTitleText>}>
              <Card>
                <CardBody>
                  {result.hostTools &&
                    result.hostTools.map(host => (
                      <DataList aria-label="Simple data list example">
                        {Object.entries(host.tools).map(([label, value]) => (
                          <DataListItem aria-labelledby="simple-item1">
                            <DataListItemRow>
                              <DataListItemCells
                                dataListCells={[
                                  <DataListCell key="primary content">
                                    <span id="simple-item1">{label}</span>
                                  </DataListCell>,
                                  <DataListCell key="secondary content">{value}</DataListCell>,
                                ]}
                              />
                            </DataListItemRow>
                          </DataListItem>
                        ))}
                      </DataList>
                    ))}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default connect(() => ({}))(Summary);
