import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Spin, Tag } from 'antd';
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

import TableFilterSelection from '@/components/TableFilterSelection';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { filterIterations } from '../../utils/parse';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ datastore, global, dashboard, loading }) => ({
  iterations: dashboard.iterations,
  iterationParams: dashboard.iterationParams,
  results: dashboard.results,
  controllers: dashboard.controllers,
  datastoreConfig: datastore.datastoreConfig,
  selectedControllers: global.selectedControllers,
  selectedResults: global.selectedResults,
  selectedIndices: global.selectedIndices,
  selectedIterationKeys: global.selectedIterationKeys,
  loading: loading.effects['dashboard/fetchIterationSamples'],
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
    const { selectedResults, selectedIndices, datastoreConfig, dispatch } = this.props;

    dispatch({
      type: 'dashboard/fetchIterationSamples',
      payload: { selectedResults, selectedIndices, datastoreConfig },
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
    const { iterationParams, selectedControllers, loading } = this.props;
    return (
      <PageHeaderLayout
        title={selectedControllers.join(', ')}
        selectedControllers={selectedControllers}
      >
        <Card>
          <Spin spinning={loading} tip="Loading Iterations...">
            <Button
              type="primary"
              style={{ marginBottom: 16 }}
              name="Compare Iterations"
              onClick={this.onCompareIterations}
              disabled={Object.values(resultIterations).length === 0}
            />
            <TableFilterSelection onFilterTable={this.onFilterTable} filters={iterationParams} />
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
                        <Tag color="blue">{run.run_controller}</Tag>
                      </span>
                    </div>

                    <Table
                      rowSelection={rowSelection}
                      columns={run.columns}
                      dataSource={Object.values(run.iterations)}
                      bordered
                    />
                  </div>
                );
              })
            ) : (
              <EmptyState>
                <EmptyStateIcon icon={SearchIcon} />
                <Title size="lg">No iterations found</Title>
                <EmptyStateBody>
                  Unable to find iterations for the selected runs. Please try a different run set.
                </EmptyStateBody>
              </EmptyState>
            )}
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(() => ({}))(ComparisonSelect);
