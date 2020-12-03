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
  Spinner,
  Tooltip,
} from '@patternfly/react-core';

import SearchBar from '@/components/SearchBar';
import AntdDatePicker from '@/components/DatePicker';
import Table from '@/components/Table';
import { getDiffDate } from '@/utils/moment_constants';
import { isLoggedInUser } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ datastore, global, dashboard, loading, user, auth }) => ({
  controllers: dashboard.controllers,
  indices: datastore.indices,
  selectedDateRange: global.selectedDateRange,
  favoriteControllers: user.favoriteControllers,
  auth: auth.auth,
  loadingControllers:
    loading.effects['dashboard/fetchControllers'] || loading.effects['datastore/fetchMonthIndices'],
}))
class Controllers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      controllers: props.controllers,
    };
  }

  componentDidMount() {
    const { controllers } = this.state;
    const { indices, selectedDateRange } = this.props;

    if (
      controllers.length === 0 ||
      indices.length === 0 ||
      selectedDateRange.start === '' ||
      selectedDateRange.end === ''
    ) {
      this.fetchMonthIndices();
    }
  }

  componentDidUpdate(prevProps) {
    const { controllers } = this.props;

    if (prevProps.controllers !== controllers) {
      this.setState({ controllers });
    }
  }

  fetchMonthIndices = async () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'datastore/fetchMonthIndices',
    }).then(() => {
      this.fetchControllers();
    });
  };

  fetchControllers = () => {
    const { dispatch, selectedDateRange } = this.props;
    dispatch({
      type: 'dashboard/fetchControllers',
      payload: { selectedDateRange },
    });
  };

  onSearch = searchValue => {
    const { controllers } = this.props;
    const reg = new RegExp(searchValue, 'gi');
    const controllersSearch = controllers.slice();
    this.setState({
      controllers: controllersSearch
        .map(record => {
          const match = record.controller.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            controller: (
              <span key={record}>
                {record.controller.split(reg).map(
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

  retrieveResults = controller => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedControllers',
      payload: [controller.key],
    }).then(() => {
      dispatch(
        routerRedux.push({
          pathname: '/results',
        })
      );
    });
  };

  favoriteRecord = (event, value, controller) => {
    // Stop propagation from going to the next page
    event.stopPropagation();
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/favoriteController',
      payload: controller,
    });
  };

  render() {
    const { controllers } = this.state;
    const { loadingControllers, favoriteControllers, auth } = this.props;
    const columns = [
      {
        title: 'Controller',
        dataIndex: 'controller',
        key: 'controller',
        sorter: (a, b) => a.key.localeCompare(b.key),
      },
      {
        title: 'Last Modified',
        dataIndex: 'last_modified_string',
        key: 'last_modified_string',
        sorter: (a, b) => a.last_modified_value - b.last_modified_value,
        render: val => (
          <Tooltip content={val}>
            <span>{getDiffDate(val)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Results',
        dataIndex: 'results',
        key: 'results',
        sorter: (a, b) => a.results - b.results,
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        className: isLoggedInUser(auth) ? null : styles.hide,
        render: (value, row) => {
          // if already favorited return a filled star,
          // else allow user to favorite a record
          let isFavorite = false;
          favoriteControllers.forEach(item => {
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
            <Text component="h1">Controllers</Text>
          </TextContent>
        </PageSection>
        <Divider component="div" />
        <PageSection>
          <Card>
            {loadingControllers ? (
              <Spinner
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              />
            ) : (
              <CardBody>
                <Form
                  layout="inline"
                  style={{ display: 'flex', flex: 1, alignItems: 'center', marginBottom: 16 }}
                >
                  <SearchBar
                    style={{ marginRight: 32 }}
                    placeholder="Search controllers"
                    onSearch={this.onSearch}
                  />
                  <AntdDatePicker onChangeCallback={this.fetchControllers} />
                </Form>
                <Tabs type="card">
                  <TabPane tab="Controllers" key="controllers">
                    <Table
                      style={{ marginTop: 20 }}
                      columns={columns}
                      dataSource={controllers}
                      onRow={record => ({
                        onClick: () => {
                          this.retrieveResults(record);
                        },
                      })}
                      loading={loadingControllers}
                    />
                  </TabPane>
                  <TabPane tab="Favorites" key="favorites">
                    <Table
                      style={{ marginTop: 20 }}
                      columns={columns}
                      dataSource={favoriteControllers}
                      onRow={record => ({
                        onClick: () => {
                          this.retrieveResults(record);
                        },
                      })}
                      loading={loadingControllers}
                    />
                  </TabPane>
                </Tabs>
              </CardBody>
            )}
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default Controllers;
