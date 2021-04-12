import React, { Component } from 'react';
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
  Spinner,
} from '@patternfly/react-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import AntdDatePicker from '@/components/DatePicker';
import Table from '@/components/Table';
import { getDiffDate } from '@/utils/moment_constants';

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
      payload: [controller],
    }).then(() => {
      dispatch(
        routerRedux.push({
          pathname: '/results',
        })
      );
    });
  };

  favoriteController = controller => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/favoriteController',
      payload: controller,
    });
  };

  unfavoriteController = controller => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/removeControllerFromFavorites',
      payload: controller,
    });
  };

  render() {
    const { controllers } = this.state;
    const { loadingControllers, favoriteControllers } = this.props;
    const columns = [
      {
        Header: 'Controller',
        accessor: 'controller',
        Cell: row => (
          <span>
            <a onClick={() => this.retrieveResults(row.value)}>{row.value}</a>
          </span>
        ),
      },
      {
        Header: 'Last Modified',
        accessor: 'last_modified_value',
        Cell: row => <span>{getDiffDate(row.value)}</span>,
      },
      {
        Header: 'Results',
        accessor: 'results',
      },
      {
        Header: 'Favorited',
        accessor: 'favorited',
        Cell: cell =>
          favoriteControllers.includes(cell.row.original.controller) ? (
            <FontAwesomeIcon
              color="gold"
              icon={faStar}
              onClick={() => this.unfavoriteController(cell.row.original.controller)}
            />
          ) : (
            <FontAwesomeIcon
              color="lightgrey"
              icon={faStar}
              onClick={() => this.favoriteController(cell.row.original.controller)}
            />
          ),
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
                <AntdDatePicker
                  style={{ width: 400, marginBottom: 16 }}
                  onChangeCallback={this.fetchControllers}
                />
                <Table
                  style={{ marginTop: 20 }}
                  columns={columns}
                  data={controllers}
                  onRowClick={record => {
                    this.retrieveResults(record);
                  }}
                  loadingData={loadingControllers}
                />
              </CardBody>
            )}
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default Controllers;
