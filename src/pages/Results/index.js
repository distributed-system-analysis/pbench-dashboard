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
} from '@patternfly/react-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Table from '@/components/Table';
import { getDiffDate } from '@/utils/moment_constants';

@connect(({ global, dashboard, loading, user, auth }) => ({
  selectedDateRange: global.selectedDateRange,
  results: dashboard.results[global.selectedControllers[0]]
    ? dashboard.results[global.selectedControllers[0]]
    : [],
  username: auth.username,
  selectedControllers: global.selectedControllers,
  favoriteResults: user.favoriteResults,
  loading: loading.effects['dashboard/fetchResults'],
}))
class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: props.results,
    };
  }

  componentDidMount() {
    const { dispatch, username, results, selectedDateRange, selectedControllers } = this.props;

    if (results.length === 0) {
      dispatch({
        type: 'dashboard/fetchResults',
        payload: {
          selectedDateRange,
          username,
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

  compareResults = selectedRows => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedResults',
      payload: selectedRows.map(row => row.original.result),
    });

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
      payload: [params],
    });

    dispatch(
      routerRedux.push({
        pathname: '/summary',
      })
    );
  };

  favoriteResult = result => {
    const { dispatch } = this.props;
    // dispatch an action to favorite result
    dispatch({
      type: 'user/favoriteResult',
      payload: result,
    });
  };

  unfavoriteResult = result => {
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/removeResultFromFavorites',
      payload: result,
    });
  };

  render() {
    const { results } = this.state;
    const { selectedControllers, loading, favoriteResults, username } = this.props;
    const columns = [
      {
        Header: 'Result',
        accessor: 'result',
        Cell: row => <span>{row.value}</span>,
      },
      {
        Header: 'Config',
        accessor: 'config',
      },
      {
        Header: 'Start Time',
        accessor: 'start',
        Cell: row => <span>{getDiffDate(row.value)}</span>,
      },
      {
        Header: 'End Time',
        accessor: 'end',
        Cell: row => <span>{getDiffDate(row.value)}</span>,
      },
      {
        Header: 'Favorited',
        accessor: 'favorited',
        show: username !== '',
        Cell: cell =>
          favoriteResults.includes(cell.row.original.result) ? (
            <FontAwesomeIcon
              color="gold"
              icon={faStar}
              onClick={e => {
                e.stopPropagation();
                this.unfavoriteResult(cell.row.original.result);
              }}
            />
          ) : (
            <FontAwesomeIcon
              color="lightgrey"
              icon={faStar}
              onClick={e => {
                e.stopPropagation();
                this.favoriteResult(cell.row.original.result);
              }}
            />
          ),
      },
    ];

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{selectedControllers.join(', ')}</Text>
          </TextContent>
        </PageSection>
        <Divider />
        <PageSection>
          <Card>
            <CardBody>
              <Table
                onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                columns={columns}
                data={results}
                onRowClick={row => {
                  const { result } = row;
                  this.retrieveResults(result);
                }}
                loadingData={loading}
                isCheckable
                bordered
              />
            </CardBody>
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default Results;
