import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Tabs } from 'antd';
import {
  PageSection,
  PageSectionVariants,
  Divider,
  Text,
  TextContent,
  Card,
  CardBody,
  Tooltip,
} from '@patternfly/react-core';

import SearchBar from '@/components/SearchBar';
import RowSelection from '@/components/RowSelection';
import Table from '@/components/Table';
import { getDiffDate } from '@/utils/moment_constants';
import { isLoggedInUser } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ global, dashboard, loading, user, auth }) => ({
  selectedDateRange: global.selectedDateRange,
  results: dashboard.results[global.selectedControllers[0]]
    ? dashboard.results[global.selectedControllers[0]]
    : [],
  auth: auth.auth,
  selectedControllers: global.selectedControllers,
  favoriteResults: user.favoriteResults,
  loading: loading.effects['dashboard/fetchResults'],
}))
class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: props.results,
      selectedRows: [],
    };
  }

  componentDidMount() {
    const { dispatch, results, selectedDateRange, selectedControllers } = this.props;

    if (results.length === 0) {
      dispatch({
        type: 'dashboard/fetchResults',
        payload: {
          selectedDateRange,
          controller: selectedControllers,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { results } = this.props;

    if (prevProps.results !== results) {
      this.setState({ results });
    }
  }

  onSelectChange = selectedRows => {
    const { dispatch } = this.props;

    this.setState({ selectedRows });

    dispatch({
      type: 'global/updateSelectedResults',
      payload: selectedRows,
    });
  };

  onSearch = searchValue => {
    const { results } = this.props;
    const reg = new RegExp(searchValue, 'gi');
    const resultsSearch = results.slice();
    this.setState({
      results: resultsSearch
        .map(record => {
          const match = record['run.name'].match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            'run.name': (
              <span key={record}>
                {record['run.name'].split(reg).map(
                  (text, index) =>
                    index > 0
                      ? [
                          // eslint-disable-next-line react/jsx-indent
                          <span key={text} style={{ color: 'orange' }}>
                            {match[0]}
                          </span>,
                          text,
                        ]
                      : text
                )}
              </span>
            ),
          };
        })
        .filter(record => !!record),
    });
  };

  compareResults = () => {
    const { dispatch } = this.props;

    dispatch(
      routerRedux.push({
        pathname: '/comparison-select',
      })
    );
  };

  retrieveResults = params => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedResults',
      payload: params,
    });

    dispatch(
      routerRedux.push({
        pathname: '/summary',
      })
    );
  };

  favoriteRecord = (event, value, result) => {
    // Stop propagation from going to the next page
    event.stopPropagation();
    const { dispatch } = this.props;
    // dispatch an action to favorite result
    dispatch({
      type: 'user/favoriteResult',
      payload: result,
    });
  };

  render() {
    const { results, selectedRows } = this.state;
    const { selectedControllers, loading, favoriteResults, auth } = this.props;
    const rowSelection = {
      // eslint-disable-next-line no-shadow
      onSelect: (record, selected, selectedRows) => this.onSelectChange(selectedRows),
    };
    const columns = [
      {
        title: 'Result',
        dataIndex: 'run.name',
        key: 'run.name',
        sorter: (a, b) => a.key.localeCompare(b.key),
      },
      {
        title: 'Config',
        dataIndex: 'run.config',
        key: 'run.config',
      },
      {
        title: 'Start Time',
        dataIndex: 'run.start',
        key: 'run.start',
        sorter: (a, b) => a.startUnixTimestamp - b.startUnixTimestamp,
        render: val => (
          <Tooltip content={val}>
            <span>{getDiffDate(val)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'End Time',
        dataIndex: 'run.end',
        key: 'run.end',
        render: val => (
          <Tooltip content={val}>
            <span>{getDiffDate(val)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        className: isLoggedInUser(auth) ? null : styles.hide,
        key: 'actions',
        render: (value, row) => {
          // if already favorited return a filled star,
          // else allow user to favorite a record
          let isFavorite = false;
          favoriteResults.forEach(item => {
            if (item.key === row.key) {
              isFavorite = true;
            }
          });
          if (isFavorite) {
            return <Icon type="star" theme="filled" />;
          }
          return (
            <a onClick={e => this.favoriteRecord(e, null, row)}>
              <Icon type="star" />
            </a>
          );
        },
      },
    ];

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
            <CardBody>
              <Form layout="vertical">
                <SearchBar
                  style={{ marginBottom: 16 }}
                  placeholder="Search results"
                  onSearch={this.onSearch}
                />
                <RowSelection
                  selectedItems={selectedRows}
                  compareActionName="Compare Results"
                  onCompare={this.compareResults}
                />
              </Form>
              <Tabs type="card" style={{ marginTop: 16 }}>
                <TabPane tab="Results" key="results">
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={results}
                    onRow={record => ({
                      onClick: () => {
                        this.retrieveResults([record]);
                      },
                    })}
                    loading={loading}
                    bordered
                  />
                </TabPane>
                <TabPane tab="Favorites" key="favorites">
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={favoriteResults}
                    onRow={record => ({
                      onClick: () => {
                        this.retrieveResults([record]);
                      },
                    })}
                    loading={loading}
                    bordered
                  />
                </TabPane>
              </Tabs>
            </CardBody>
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default Results;
