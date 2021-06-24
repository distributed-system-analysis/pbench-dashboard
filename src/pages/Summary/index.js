import React from 'react';
import { connect } from 'dva';
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
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';
import Table from '@/components/Table';
import TableFilterSelection from '@/components/TableFilterSelection';
import { filterIterations } from '../../utils/parse';

const tocColumns = [
  {
    // Build our expander column
    id: 'expander', // Make sure it has an ID
    Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
      <span {...getToggleAllRowsExpandedProps()}>
        {isAllRowsExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
      </span>
    ),
    Cell: ({ row }) =>
      // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
      // to build the toggle for expanding a row
      row.canExpand ? (
        <span
          {...row.getToggleRowExpandedProps({
            style: {
              // We can even use the row.depth property
              // and paddingLeft to indicate the depth
              // of the row
              paddingLeft: `${row.depth * 2}rem`,
            },
          })}
        >
          {row.isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
        </span>
      ) : null,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Size',
    accessor: 'size',
  },
  {
    Header: 'Mode',
    accessor: 'mode',
  },
];

@connect(({ global, dashboard, loading, auth }) => ({
  iterations: dashboard.iterations,
  iterationParams: dashboard.iterationParams,
  result: dashboard.result,
  username: auth.username,
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
    const { dispatch, selectedDateRange, selectedResults, username } = this.props;
    const { match } = this.props;

    if (match.params) {
      dispatch({
        type: 'global/updateSelectedControllers',
        payload: [match.params.controller],
      });
      dispatch({
        type: 'global/updateSelectedResults',
        payload: [match.params.result],
      });
    }

    dispatch({
      type: 'dashboard/fetchIterationSamples',
      payload: { selectedResults, selectedDateRange },
    });
    dispatch({
      type: 'dashboard/fetchResult',
      payload: {
        selectedDateRange,
        username,
        result: selectedResults[0].values.result,
      },
    });
    dispatch({
      type: 'dashboard/fetchTocResult',
      payload: {
        selectedDateRange,
        id: selectedResults[0].original.id,
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

  render() {
    const { activeTabKey, resultIterations } = this.state;
    const {
      loadingSummary,
      iterationParams,
      selectedControllers,
      selectedResults,
      tocResult,
      result,
    } = this.props;

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{selectedControllers.join(', ')}</Text>
            <Text component="h1">{selectedResults[0].result}</Text>
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
                  {loadingSummary ? (
                    <Bullseye>
                      <Spinner />
                    </Bullseye>
                  ) : (
                    <>
                      <TableFilterSelection
                        onFilterTable={this.onFilterTable}
                        filters={iterationParams}
                      />
                      <Table
                        style={{ marginTop: 16 }}
                        columns={
                          resultIterations[Object.keys(resultIterations)[0]]
                            ? resultIterations[Object.keys(resultIterations)[0]].columns
                            : []
                        }
                        data={
                          resultIterations[Object.keys(resultIterations)[0]]
                            ? Object.values(
                                resultIterations[Object.keys(resultIterations)[0]].iterations
                              )
                            : []
                        }
                        bordered
                      />
                    </>
                  )}
                </CardBody>
              </Card>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Table of Contents</TabTitleText>}>
              <Card>
                <CardBody>
                  <Table columns={tocColumns} data={tocResult} defaultExpandAllRows isExpandable />
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
