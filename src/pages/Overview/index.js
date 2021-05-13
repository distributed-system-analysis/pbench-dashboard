import React from 'react';
import { routerRedux } from 'dva/router';
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
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Tooltip,
} from '@patternfly/react-core';
import { Icon } from 'antd';
import { connect } from 'dva';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutlinedClockIcon, UndoAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { getDiffDays, getDiffDate } from '../../utils/moment_constants';
import Table from '@/components/Table';
import styles from './index.less';

const expirationLimit = { val: 30 };

@connect(({ global, user, loading, dashboard }) => ({
  selectedDateRange: global.selectedDateRange,
  selectedControllers: global.selectedControllers,
  user: user.user,
  favoriteControllers: user.favoriteControllers,
  seenResults: user.seenResults,
  results: dashboard.results,
  loading: loading.effects['dashboard/fetchResults'],
}))
class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManageRunDropdownOpen: false,
      totalResultData: [],
      newData: [],
      unlabledData: [],
      newRunsSelectedRows: [],
    };
  }

  componentDidMount() {
    this.getRunResult();
  }

  getRunResult() {
    const { dispatch, selectedDateRange, selectedControllers } = this.props;
    dispatch({
      type: 'dashboard/fetchResults',
      payload: {
        selectedDateRange,
        controller: selectedControllers,
      },
    }).then(() => {
      this.getSeperatedResults();
    });
  }

  getSeperatedResults() {
    const { results, selectedControllers } = this.props;
    let { totalResultData } = this.state;
    totalResultData =
      totalResultData.length === 0 ? results[selectedControllers[0]] : totalResultData;
    const unlabledData = totalResultData.filter(x => x.saved === true);
    const newData = totalResultData.filter(x => x.saved !== true);
    this.setState({
      newData,
      unlabledData,
      totalResultData,
    });
  }

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

  removeControllerFromFavorites = (event, value, controller) => {
    // Stop propagation from going to the next page
    event.stopPropagation();
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/removeControllerFromFavorites',
      payload: controller,
    });
  };

  showDrowpdown = id => {
    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  saveRuns = keys => {
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    keys.forEach(function(key) {
      totalResultData.filter(item => item.key === key)[0].saved = true;
    });
    this.setState(
      {
        totalResultData,
      },
      () => {
        dispatch({
          type: 'dashboard/getPrivateResults',
          payload: totalResultData,
        });
        this.getSeperatedResults();
      }
    );
  };

  deleteResult = keys => {
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    const updatedResult = totalResultData.filter(item => !keys.includes(item.key));
    this.setState(
      {
        totalResultData: updatedResult,
      },
      () => {
        dispatch({
          type: 'global/updateResults',
          payload: totalResultData,
        });
        this.getSeperatedResults();
      }
    );
  };

  onToggleManageRunDropdown = isManageRunDropdownOpen => {
    this.setState({
      isManageRunDropdownOpen,
    });
  };

  onSelectManageRunDropdown = () => {
    const { isManageRunDropdownOpen } = this.state;
    this.setState({
      isManageRunDropdownOpen: !isManageRunDropdownOpen,
    });
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
          pathname: 'private/result',
        })
      );
    });
  };

  navigateToExpiringResult = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: 'private/expiringresults',
      })
    );
  };

  markResultSeen = controller => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/markResultSeen',
      payload: controller,
    });
  };

  removeResultFromSeen = controller => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/removeResultFromSeen',
      payload: controller,
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

  onMultiNewRowSelection = newRunsSelectedRowKeys => {
    console.log(newRunsSelectedRowKeys);
  };

  render() {
    const {
      newData,
      unlabledData,
      isManageRunDropdownOpen,
      newRunsSelectedRows,
      newRunsSelectedRowKeys,
    } = this.state;

    const { favoriteControllers, seenResults } = this.props;
    const newDataColumns = [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '-' : '+'}</span>
        ),
      },
      {
        Header: 'Result',
        accessor: 'result',
        Cell: cell => {
          const row = cell.row.original;
          let isSeen = false;
          if (seenResults !== []) {
            seenResults.forEach(item => {
              if (item.original.key === row.key) {
                isSeen = true;
              }
            });
          }
          if (isSeen) {
            return (
              <div>
                <Button
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px' }}
                  onClick={() => this.retrieveResults(cell.row)}
                >
                  {cell.value}
                </Button>
                <br />
                <Text component={TextVariants.p} className={styles.subText}>
                  <span className={styles.label}>{row.controller}</span>
                </Text>
              </div>
            );
          }
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.retrieveResults(cell.row)}
              >
                <i>{cell.value}</i>
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
          <Tooltip content={cell.value}>
            <span>{getDiffDate(cell.value)}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'Scheduled for deletion on',
        accessor: 'deletion',
        Cell: cell => {
          const remainingDays = getDiffDays(cell.value);
          if (remainingDays > 15) {
            return (
              <div>
                <Text>{cell.value}</Text>
                <Progress
                  min={0}
                  max={expirationLimit.val}
                  value={expirationLimit.val - remainingDays}
                  size={ProgressSize.sm}
                  measureLocation={ProgressMeasureLocation.none}
                />
              </div>
            );
          }
          return (
            <div>
              <span>{cell.value}</span>
              <Progress
                min={0}
                max={expirationLimit.val}
                value={expirationLimit.val - remainingDays}
                size={ProgressSize.sm}
                variant={ProgressVariant.danger}
                measureLocation={ProgressMeasureLocation.none}
              />
            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'fav',
        Cell: cell => {
          const row = cell.row.original;
          let isFavorite = false;
          favoriteControllers.forEach(item => {
            if (item.key === row.key) {
              isFavorite = true;
            }
          });
          if (isFavorite) {
            return (
              <a onClick={e => this.removeControllerFromFavorites(e, null, row)}>
                <Icon type="star" theme="filled" />
              </a>
            );
          }
          return (
            <a onClick={e => this.favoriteRecord(e, null, [row])}>
              <Icon type="star" />
            </a>
          );
        },
      },
      {
        Header: '',
        accessor: 'action',
        Cell: cell => {
          const row = cell.row.original;
          return (
            <div>
              <EllipsisVIcon
                onClick={() => this.showDrowpdown(`newrun${row.key}`)}
                className="dropbtn"
              />
              <div className={styles.dropdown} id={`newrun${row.key}`} style={{ display: 'none' }}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownLink} onClick={() => this.saveRuns([row.key])}>
                    Save Runs
                  </div>
                  <div
                    className={styles.dropdownLink}
                    onClick={() => this.removeResultFromSeen([row.key])}
                  >
                    Mark unread
                  </div>
                  <div className={styles.dropdownLink} onClick={() => this.deleteResult([row.key])}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          );
        },
      },
    ];

    const seenDataColumns = [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>{row.isExpanded ? '-' : '+'}</span>
        ),
      },
      {
        Header: 'Result',
        accessor: 'result',
        Cell: cell => {
          const row = cell.row.original;
          let isSeen = false;
          if (seenResults !== []) {
            seenResults.forEach(item => {
              if (item.key === row.key) {
                isSeen = true;
              }
            });
          }
          if (isSeen) {
            return (
              <div>
                <Button
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px' }}
                  onClick={() => this.retrieveResults(cell.row)}
                >
                  {cell.value}
                </Button>
                <br />
                <Text component={TextVariants.p} className={styles.subText}>
                  <span className={styles.label}>{row.controller}</span>
                </Text>
              </div>
            );
          }
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.retrieveResults(cell.row)}
              >
                <b>{cell.value}</b>
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
          <Tooltip content={cell.value}>
            <span>{getDiffDate(cell.value)}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'Scheduled for deletion on',
        accessor: 'deletion',
        Cell: cell => {
          const remainingDays = getDiffDays(cell.value);
          if (remainingDays > 15) {
            return (
              <div>
                <Text>{cell.value}</Text>
                <Progress
                  min={0}
                  max={expirationLimit.val}
                  value={expirationLimit.val - remainingDays}
                  size={ProgressSize.sm}
                  measureLocation={ProgressMeasureLocation.none}
                />
              </div>
            );
          }
          return (
            <div>
              <span>{cell.value}</span>
              <Progress
                min={0}
                max={expirationLimit.val}
                value={expirationLimit.val - remainingDays}
                size={ProgressSize.sm}
                variant={ProgressVariant.danger}
                measureLocation={ProgressMeasureLocation.none}
              />
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: '',
        accessor: 'fav',
        Cell: cell => {
          const row = cell.row.original;
          let isFavorite = false;
          favoriteControllers.forEach(item => {
            if (item.key === row.key) {
              isFavorite = true;
            }
          });
          if (isFavorite) {
            return (
              <a onClick={e => this.removeControllerFromFavorites(e, null, row)}>
                <Icon type="star" theme="filled" />
              </a>
            );
          }
          return (
            <a onClick={e => this.favoriteRecord(e, null, [row])}>
              <Icon type="star" />
            </a>
          );
        },
      },
      {
        Header: '',
        accessor: 'action',
        Cell: cell => {
          const row = cell.row.original;
          return (
            <div>
              <EllipsisVIcon
                onClick={() => this.showDrowpdown(`newrun${row.key}`)}
                className="dropbtn"
              />
              <div className={styles.dropdown} id={`newrun${row.key}`} style={{ display: 'none' }}>
                <div className={styles.dropdownContent}>
                  <div
                    className={styles.dropdownLink}
                    onClick={() => this.removeResultFromSeen([row.key])}
                  >
                    Mark unread
                  </div>
                  <div className={styles.dropdownLink} onClick={() => this.deleteResult([row.key])}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
          );
        },
      },
    ];

    const expiringSoonTableColumn = [
      {
        Header: 'Result',
        accessor: 'result',
        Cell: cell => {
          const row = cell.row.original;
          let isSeen = false;
          if (seenResults !== []) {
            seenResults.forEach(item => {
              if (item.key === row.key) {
                isSeen = true;
              }
            });
          }
          if (isSeen) {
            return (
              <div>
                <Button
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px' }}
                  onClick={() => this.retrieveResults(cell.row)}
                >
                  {cell.value}
                </Button>
                <br />
                <Text component={TextVariants.p} className={styles.subText}>
                  <OutlinedClockIcon />
                  <span className={styles.label}>{row.deletion}</span>
                </Text>
              </div>
            );
          }
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.retrieveResults(cell.row)}
              >
                <b>{cell.value}</b>
              </Button>
              <br />
              <Text component={TextVariants.p} className={styles.subText}>
                <OutlinedClockIcon />
                <span className={styles.label}>{row.deletion}</span>
              </Text>
            </div>
          );
        },
      },
    ];

    const manageRunDropdown = [
      <DropdownItem
        key="save"
        className={styles.ulclass}
        onClick={() => this.saveRuns(newRunsSelectedRowKeys)}
      >
        {' '}
        Save Runs
      </DropdownItem>,
      <DropdownItem
        key="unread"
        className={styles.ulclass}
        onClick={() => this.removeResultFromSeen(newRunsSelectedRowKeys)}
      >
        {' '}
        Mark as unread
      </DropdownItem>,
      <DropdownItem
        key="favourite"
        className={styles.ulclass}
        onClick={e => this.favoriteRecord(e, null, newRunsSelectedRows)}
      >
        Mark Favourited
      </DropdownItem>,
      <DropdownSeparator key="separator" />,
      <DropdownItem
        key="delete"
        className={styles.ulclass}
        onClick={() => this.deleteResult(newRunsSelectedRowKeys)}
      >
        Delete runs
      </DropdownItem>,
    ];

    return (
      <div className={styles.paddingBig}>
        <TextContent className={styles.paddingSmall}>
          <Text component={TextVariants.h1}> Overview</Text>
        </TextContent>
        <Grid hasGutter>
          <GridItem span={3}>
            <Card className={styles.parallalCard}>
              <div className={styles.expiringValues}>
                <div className={styles.paddingBig}>
                  <TextContent>
                    <Text component={TextVariants.h3}>
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        color="red"
                        className={styles.icons}
                      />
                      Expiring Soon
                    </Text>
                    <Text component={TextVariants.p} className={styles.subText}>
                      These runs will be automatically deleted from the sysem if left
                      unacknowledged.
                      <Button variant="link" isInline>
                        Learn more
                      </Button>
                    </Text>
                  </TextContent>
                </div>
                <div className={styles.paddingSmall}>
                  <Table columns={expiringSoonTableColumn} data={newData} />
                </div>
              </div>
              <Card className={styles.subCard}>
                <div className={styles.paddingSmall}>
                  <Button variant="link" isInline onClick={() => this.navigateToExpiringResult()}>
                    View all warnings
                  </Button>
                </div>
              </Card>
            </Card>
          </GridItem>
          <GridItem span={9}>
            <Card className={styles.parallalCard}>
              <div className={styles.paddingBig}>
                <TextContent>
                  <Text component={TextVariants.h3}>
                    {' '}
                    New and unmanaged Runs
                    <span style={{ float: 'right' }}>
                      <Button
                        variant="link"
                        icon={<UndoAltIcon />}
                        onClick={() => this.getRunResult()}
                      >
                        Refresh results
                      </Button>
                      <Dropdown
                        onSelect={this.onSelectManageRunDropdown}
                        toggle={
                          <DropdownToggle
                            onToggle={this.onToggleManageRunDropdown}
                            toggleIndicator={CaretDownIcon}
                            isPrimary
                            id="toggle-id-4"
                          >
                            Manage runs
                          </DropdownToggle>
                        }
                        isOpen={isManageRunDropdownOpen}
                        dropdownItems={manageRunDropdown}
                      />
                    </span>
                  </Text>
                </TextContent>
              </div>
              <div className={styles.newRunTable}>
                <div className={styles.paddingSmall}>
                  <Table
                    onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                    columns={newDataColumns}
                    onRowClick={record => {
                      this.retrieveResults(record);
                    }}
                    renderRowSubComponent={record => <p>{record.row.original.config}</p>}
                    data={newData}
                    onMultiNewRowSelection={selectedRowIds =>
                      this.onMultiNewRowSelection(selectedRowIds)
                    }
                    isCheckable
                  />
                </div>
              </div>
            </Card>
          </GridItem>
        </Grid>
        <Grid hasGutter style={{ marginTop: '16px' }}>
          <GridItem span={12}>
            <Card>
              <div className={styles.paddingSmall}>
                <TextContent className={styles.paddingSmall}>
                  <Text component={TextVariants.h3}> Saved Runs</Text>
                </TextContent>
                <Button variant="link">Go to all runs</Button>
              </div>
              <div>
                <div className={styles.paddingSmall}>
                  <Table
                    onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                    columns={seenDataColumns}
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.config}</p>}
                    onRowClick={record => {
                      this.retrieveResults(record);
                    }}
                    renderRowSubComponent={record => <p>{record.row.original.config}</p>}
                    data={unlabledData}
                    isCheckable
                  />
                </div>
              </div>
            </Card>
          </GridItem>
        </Grid>
      </div>
    );
  }
}

export default Overview;
