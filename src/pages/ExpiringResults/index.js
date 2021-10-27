import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Grid,
  GridItem,
  Card,
  TextContent,
  Text,
  TextVariants,
  Button,
  Progress,
  ProgressSize,
  ProgressMeasureLocation,
  ProgressVariant,
  Tooltip,
  Modal,
  Alert,
  AlertGroup,
} from '@patternfly/react-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { formatDate, getDiffDays, getDiffDate } from '../../utils/moment_constants';
import Table from '@/components/Table';
import styles from './index.less';

@connect(({ global, user, dashboard }) => ({
  selectedDateRange: global.selectedDateRange,
  selectedControllers: global.selectedControllers,
  user: user.user,
  seenResults: user.seenResults,
  favoriteResults: user.favoriteResults,
  results: dashboard.results,
}))
class ExpiringResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalResultData: [],
      toBeDeletedData: [],
      isModalOpen: false,
      actionMessage: '',
    };
  }

  componentDidMount() {
    const { dispatch, selectedControllers, selectedDateRange } = this.props;
    dispatch({
      type: 'dashboard/fetchResults',
      payload: {
        selectedDateRange,
        controller: selectedControllers,
      },
    }).then(() => {
      const { results } = this.props;
      this.setState({
        totalResultData: results[selectedControllers[0] || 'mock-controller'],
      });
    });
  }

  favoriteResult = row => {
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/favoriteResult',
      payload: row,
    });
  };

  unfavoriteResult = row => {
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/removeResultFromFavorites',
      payload: row,
    });
  };

  deleteResult = (e, rows) => {
    // Stop propagation from going to the next page
    if (e !== null) {
      e.stopPropagation();
    }
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    const updatedResult = totalResultData.filter(item => !rows.includes(item.result));
    dispatch({ type: 'dashboard/updateResults', payload: updatedResult })
      .then(() => {
        this.setState({ totalResultData: updatedResult });
      })
      .then(() => {
        this.handleModalToggle(e, []);
      })
      .then(() => {
        this.setState({ actionMessage: 'data succesfully deleted' });
        setTimeout(() => {
          this.setState({ actionMessage: '' });
        }, 3000);
      });
  };

  removeResultFromSeen = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/removeResultFromSeen',
      payload: row,
    });
  };

  showDropdown = (e, id) => {
    // Stop propagation from going to the next page
    e.stopPropagation();

    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  retrieveResults = row => {
    const { dispatch } = this.props;
    this.markResultSeen(row);
    dispatch({
      type: 'global/updateSelectedResults',
      payload: [row],
    }).then(() => {
      dispatch(
        routerRedux.push({
          pathname: '/result',
        })
      );
    });
  };

  markResultSeen = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/markResultSeen',
      payload: row.result,
    });
  };

  handleModalToggle(e, rows) {
    // Stop propagation from going to the next page
    if (e !== null) {
      e.stopPropagation();
    }
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen, toBeDeletedData: rows }));
  }

  render() {
    const { favoriteResults, seenResults } = this.props;
    const { totalResultData, toBeDeletedData, isModalOpen, actionMessage } = this.state;
    const seenDataColumns = [
      {
        Header: 'Result',
        accessor: 'result',
        Cell: cell => {
          const row = cell.row.original;
          return seenResults.includes(row.result) ? (
            <div>
              <Button variant="link" isInline style={{ marginBottom: '8px' }}>
                {cell.value}
              </Button>
              <br />
              <Text component={TextVariants.p} className={styles.subText}>
                <span className={styles.label}>{row.controller}</span>
              </Text>
            </div>
          ) : (
            <div>
              <Button variant="link" isInline style={{ marginBottom: '8px' }}>
                <b>
                  <i>{cell.value}</i>
                </b>
              </Button>
              <br />
              <Text component={TextVariants.p} className={styles.subText}>
                <span className={styles.label}>{row.controller}</span>
              </Text>
            </div>
          );
        },
      },
      {
        Header: 'End Time',
        accessor: 'end',
        Cell: cell => (
          <Tooltip content={formatDate('utc', cell.value)}>
            <span>{formatDate('with time', cell.value)}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'Scheduled for deletion on',
        accessor: 'deletion',
        Cell: cell => {
          const value = cell.row.original.serverMetadata['server.deletion'];
          const remainingDays = getDiffDays(value);
          return (
            <div>
              <Tooltip content={formatDate('without time', value)}>
                <span>{getDiffDate(value)}</span>
              </Tooltip>
              <Progress
                min={0} // max needs to be kept as substraction to start date and delection date
                max={90}
                value={90 - remainingDays}
                size={ProgressSize.sm}
                measureLocation={ProgressMeasureLocation.none}
                variant={remainingDays < 15 ? ProgressVariant.danger : ProgressVariant.info}
              />
            </div>
          );
        },
      },
      { Header: 'Status', accessor: 'status' },
      {
        Header: '',
        accessor: 'fav',
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
      {
        Header: '',
        accessor: 'action',
        Cell: cell => {
          const row = cell.row.original;
          return (
            <div>
              <EllipsisVIcon
                onClick={e => this.showDropdown(e, `newrun${row.result}`)}
                className="dropbtn"
              />
              <div id={`newrun${row.result}`} style={{ display: 'none' }}>
                <div className={styles.dropdownContent}>
                  <div
                    className={styles.dropdownLink}
                    onClick={e => this.removeResultFromSeen(e, [row.result])}
                  >
                    Mark unread
                  </div>
                  <div
                    className={styles.dropdownLink}
                    onClick={e => this.handleModalToggle(e, [row.result])}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        {actionMessage !== '' ? (
          <AlertGroup isToast style={{ display: 'block' }}>
            <Alert title={actionMessage} variant="success" />
          </AlertGroup>
        ) : (
          <></>
        )}

        <div className={styles.paddingBig}>
          <TextContent className={styles.paddingSmall}>
            <Text component={TextVariants.h1}> All runs</Text>
          </TextContent>
          <Grid hasGutter style={{ marginTop: '16px' }}>
            <GridItem span={12}>
              <Card>
                <div className={styles.paddingBig}>
                  <Table
                    columns={seenDataColumns}
                    data={totalResultData}
                    onRowClick={record => {
                      this.retrieveResults(record);
                    }}
                  />
                </div>
              </Card>
            </GridItem>
          </Grid>
        </div>
        <Modal
          title="Modal Header"
          isOpen={isModalOpen}
          onClose={e => this.handleModalToggle(e, [])}
          actions={[
            <Button
              key="confirm"
              variant="danger"
              onClick={e => this.deleteResult(e, toBeDeletedData)}
            >
              Delete
            </Button>,
            <Button key="cancel" variant="link" onClick={e => this.handleModalToggle(e, [])}>
              Cancel
            </Button>,
          ]}
        >
          <TextContent className={styles.paddingBig}>
            <Text component={TextVariants.h1}> Overview</Text>
            <Text>Are you sure you want to delete the following runs?</Text>
            {toBeDeletedData.map(item => (
              <span key={item} style={{ display: 'flex' }} className={styles.padd}>
                <Text>
                  <FontAwesomeIcon color="red" icon={faTrash} className={styles.marginRight} />
                  {item}
                </Text>
              </span>
            ))}
          </TextContent>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ExpiringResults;
