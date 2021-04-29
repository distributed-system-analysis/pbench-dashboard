import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  PageSection,
  PageSectionVariants,
  Divider,
  Text,
  TextContent,
  Card,
  CardBody,
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Chip,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import TableFilterSelection from '@/components/TableFilterSelection';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { filterIterations } from '../../utils/parse';

@connect(({ global, dashboard, loading }) => ({
  iterations: dashboard.iterations,
  iterationParams: dashboard.iterationParams,
  results: dashboard.results,
  controllers: dashboard.controllers,
  selectedControllers: global.selectedControllers,
  selectedResults: global.selectedResults,
  selectedDateRange: global.selectedDateRange,
  selectedIterationKeys: global.selectedIterationKeys,
  loadingIterations: loading.effects['dashboard/fetchIterationSamples'],
}))
class ComparisonSelect extends React.Component {
  constructor(props) {
    super(props);
    const { iterations } = props;

    this.state = {
      resultIterations: iterations,
      selectedRows: {},
    };
  }

  componentDidMount() {
    const { selectedResults, selectedDateRange, dispatch } = this.props;

    dispatch({
      type: 'dashboard/fetchIterationSamples',
      payload: { selectedResults, selectedDateRange },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { iterations } = this.props;

    if (nextProps.iterations !== iterations) {
      this.setState({ resultIterations: nextProps.iterations });
    }
  }

  onCompareIterations = () => {
    const { selectedRows, resultIterations } = this.state;

    if (Object.keys(selectedRows).length > 0) {
      this.compareIterations(selectedRows);
    } else {
      this.compareIterations(resultIterations);
    }
  };

  onSelectChange = (iteration, run) => {
    const { selectedRows } = this.state;
    selectedRows[run.id] = { ...run };
    selectedRows[run.id].iterations = {};
    selectedRows[run.id].iterations[iteration.name] = iteration;
    this.setState({ selectedRows });
  };

  onFilterTable = (selectedParams, selectedPorts) => {
    const { iterations } = this.props;

    const filteredIterations = filterIterations(iterations, selectedParams, selectedPorts);
    this.setState({ resultIterations: filteredIterations });
  };

  compareIterations = selectedIterations => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedIterations',
      payload: selectedIterations,
    }).then(() => {
      dispatch(
        routerRedux.push({
          pathname: '/comparison',
        })
      );
    });
  };

  render() {
    const { resultIterations } = this.state;
    const { iterationParams, selectedControllers, loadingIterations } = this.props;
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{selectedControllers.join(', ')}</Text>
          </TextContent>
        </PageSection>
        <Divider component="div" />
        <PageSection>
          <Card>
            {loadingIterations ? (
              <Spinner
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              />
            ) : (
              <CardBody>
                <Toolbar id="toolbar">
                  <ToolbarContent>
                    <ToolbarItem>
                      <Button
                        type="primary"
                        name="Compare Iterations"
                        onClick={this.onCompareIterations}
                        disabled={Object.values(resultIterations).length === 0}
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <TableFilterSelection
                        onFilterTable={this.onFilterTable}
                        filters={iterationParams}
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>
                {Object.values(resultIterations).length > 0 ? (
                  Object.values(resultIterations).map(run => {
                    const rowSelection = {
                      hideDefaultSelections: true,
                      onSelect: record => this.onSelectChange(record, run),
                    };
                    return (
                      <div key={run.run_name} style={{ marginTop: 32 }}>
                        <div style={{ display: 'flex' }}>
                          <h1>{run.run_name}</h1>
                          <span style={{ marginLeft: 8 }}>
                            <Chip isReadOnly isOverflowChip>
                              {run.run_controller}
                            </Chip>
                          </span>
                        </div>

                        <Table
                          rowSelection={rowSelection}
                          columns={run.columns}
                          data={Object.values(run.iterations)}
                          bordered
                        />
                      </div>
                    );
                  })
                ) : (
                  <EmptyState>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2">No iterations found</Title>
                    <EmptyStateBody>
                      Unable to find iterations for the selected runs. Please try a different run
                      set.
                    </EmptyStateBody>
                  </EmptyState>
                )}
              </CardBody>
            )}
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default connect(() => ({}))(ComparisonSelect);
