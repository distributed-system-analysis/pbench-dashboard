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
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Label,
  Modal,
  Alert,
  AlertGroup,
} from '@patternfly/react-core';
import { connect } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStopwatch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { OutlinedClockIcon, UndoAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { formatDate, getDiffDays, getDiffDate } from '../../utils/moment_constants';
import Table from '@/components/Table';
import styles from './index.less';

const expiringLimit = 15;

@connect(({ global, user, loading, dashboard }) => ({
  selectedDateRange: global.selectedDateRange,
  selectedControllers: global.selectedControllers,
  user: user.user,
  favoriteResults: user.favoriteResults,
  seenResults: user.seenResults,
  results: dashboard.results,
  loading: loading.effects['dashboard/fetchResults'],
}))
class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalResultData: [],
      newData: [],
      savedData: [],
      expiringData: [],
      expanded: true,
      isModalOpen: false,
      toBeDeletedData: [],
      actionMessage: '',
    };
  }

  componentDidMount() {
    this.fetchRunResult();
  }

  onToggle() {
    const { expanded } = this.state;
    if (expanded) {
      this.setState({ expanded: false });
    } else {
      this.setState({ expanded: true });
    }
  }

  getRunResult() {
    const { results, selectedControllers } = this.props;
    const data = results[selectedControllers[0] || 'mock-controller'];
    this.setState(
      {
        totalResultData: data,
      },
      () => this.getSeparatedResults()
    );
  }

  getSeparatedResults() {
    const { totalResultData } = this.state;
    const savedData = totalResultData.filter(x => x.serverMetadata.dashboard.saved === true);
    const newData = totalResultData.filter(x => x.serverMetadata.dashboard.saved !== true);
    const expiringData = totalResultData.filter(
      x => getDiffDays(x.serverMetadata['server.deletion']) < expiringLimit
    );
    this.setState({ newData, savedData, expiringData });
  }

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

  favoriteResult = result => {
    const { dispatch } = this.props;
    // dispatch an action to favorite controller
    dispatch({
      type: 'user/favoriteResult',
      payload: result,
    });
  };

  unfavoriteResult = result => {
    const { dispatch } = this.props;
    // dispatch an action to unfavorite controller
    dispatch({
      type: 'user/removeResultFromFavorites',
      payload: result,
    });
  };

  markResultSeen = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/markResultSeen',
      payload: row.result,
    });
  };

  removeResultFromSeen = (e, row) => {
    // Stop propagation from going to the next page
    if (e !== null) {
      e.stopPropagation();
    }
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

  saveRuns = (e, rows) => {
    // Stop propagation from going to the next page
    if (e !== null) {
      e.stopPropagation();
    }
    const { totalResultData } = this.state;
    const { dispatch } = this.props;
    const keys = rows.map(({ original }) => original.result);
    keys.forEach(key => {
      totalResultData.filter(item => item.result === key)[0].serverMetadata.dashboard.saved = true;
    });
    dispatch({
      type: 'dashboard/updateResults',
      payload: totalResultData,
    }).then(() => {
      this.setState({
        totalResultData,
      });
      this.getSeparatedResults();
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
        this.getSeparatedResults();
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

  navigateToExpiringResult = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/expiring-results',
      })
    );
  };

  fetchRunResult() {
    const { dispatch, results, selectedDateRange, selectedControllers } = this.props;
    if (Object.keys(results).length === 0) {
      dispatch({
        type: 'dashboard/fetchResults',
        payload: {
          selectedDateRange,
          controller: selectedControllers,
        },
      }).then(() => this.getRunResult());
    } else {
      this.getRunResult();
    }
  }

  handleModalToggle(e, rows) {
    // Stop propagation from going to the next page
    if (e !== null) {
      e.stopPropagation();
    }
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen, toBeDeletedData: rows }));
  }

  render() {
    const {
      newData,
      savedData,
      expiringData,
      toBeDeletedData,
      expanded,
      isModalOpen,
      actionMessage,
    } = this.state;
    const { favoriteResults, seenResults } = this.props;
    const newDataColumns = [
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
          <Tooltip content={formatDate('with time', cell.value)}>
            <span>{formatDate('without time', cell.value)}</span>
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
              <Tooltip content={formatDate('with time', value)}>
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
                  <div className={styles.dropdownLink} onClick={e => this.saveRuns(e, [cell.row])}>
                    Save Runs
                  </div>
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

    const savedDataColumns = [
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
          <Tooltip content={formatDate('with time', cell.value)}>
            <span>{formatDate('without time', cell.value)}</span>
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
              <Tooltip content={formatDate('with time', value)}>
                <span>{getDiffDate(value)}</span>
              </Tooltip>
              <Progress
                min={0}
                max={
                  90 // max needs to be kept as substraction to start date and delection date
                }
                value={90 - remainingDays}
                size={ProgressSize.sm}
                measureLocation={ProgressMeasureLocation.none}
                variant={remainingDays < 15 ? ProgressVariant.danger : ProgressVariant.info}
              />
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: cell => cell.row.original.serverMetadata['dataset.access'],
      },
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
              <div
                className={styles.dropdown}
                id={`newrun${row.result}`}
                style={{ display: 'none' }}
              >
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
              <div className={styles.displayFlex}>
                <span
                  variant="link"
                  isInline
                  style={{ marginBottom: '8px', color: 'red' }}
                  className={styles.flexItem}
                >
                  {cell.value}
                </span>
                <span>
                  <Tooltip content={formatDate('utc', row.deletion)} className={styles.flexEnd}>
                    <Text component={TextVariants.p} className={styles.subText}>
                      <span className={styles.label}>
                        <OutlinedClockIcon className={styles.paddingRight} />
                        {formatDate('utc', row.deletion)}
                      </span>
                    </Text>
                  </Tooltip>
                </span>
              </div>
            );
          }
          return (
            <div>
              <Button variant="link" isInline style={{ marginBottom: '8px' }}>
                <b>
                  <i>{cell.value}</i>
                </b>
              </Button>
              <br />
              <Tooltip content={formatDate('utc', cell.value)}>
                <Text component={TextVariants.p} className={styles.subText}>
                  <OutlinedClockIcon />
                  <span className={styles.label}>{formatDate('with time', row.deletion)}</span>
                </Text>
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.paddingBig}>
        {actionMessage !== '' && (
          <AlertGroup isToast style={{ display: 'block' }}>
            <Alert title={actionMessage} variant="success" />
          </AlertGroup>
        )}
        <Grid hasGutter span={12}>
          <Grid hasGutter span={6}>
            <GridItem>
              <TextContent className={styles.paddingBig}>
                <Text component={TextVariants.h1}> Overview</Text>
              </TextContent>
            </GridItem>
          </Grid>
        </Grid>
        <Grid hasGutter span={12}>
          <Grid hasGutter span={6}>
            <GridItem>
              <div className={styles.marginBottom}>
                <Accordion
                  asDefinitionList
                  className={
                    expiringData.length > 0 ? styles.expiringCard : styles.noExpiringRunCard
                  }
                >
                  <AccordionItem>
                    <AccordionToggle
                      onClick={() => this.onToggle()}
                      isExpanded={expanded}
                      style={{ '--pf-c-accordion__toggle--before--BackgroundColor': 'white' }}
                    >
                      <div>
                        <span>
                          <TextContent>
                            <Text component={TextVariants.h3}>
                              Expiring Soon
                              <span style={{ paddingLeft: '10px' }}>
                                <Label
                                  href="#filled"
                                  style={{ fontSize: 'x-small', color: 'gray' }}
                                >
                                  {expiringData.length} runs
                                </Label>{' '}
                              </span>
                            </Text>
                          </TextContent>
                        </span>
                      </div>
                    </AccordionToggle>
                    <AccordionContent
                      isHidden={expanded}
                      style={{
                        '--pf-c-accordion__expanded-content-body--before--BackgroundColor': 'white',
                      }}
                    >
                      <div className={styles.expiringValues}>
                        {expiringData.length > 0 ? (
                          <div>
                            <div className={styles.paddingSmall}>
                              <TextContent>
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
                              <Table columns={expiringSoonTableColumn} data={expiringData} />
                            </div>
                          </div>
                        ) : (
                          <div className={styles.centertext}>
                            <FontAwesomeIcon
                              color="gray"
                              icon={faStopwatch}
                              className={styles.stopwatchIcon}
                            />
                            <TextContent>
                              <Text component={TextVariants.h3}>
                                {' '}
                                You have no runs expiring soon
                              </Text>
                              <Text component={TextVariants.p}>
                                Runs that have expiration date within next 10days will appear here.
                                These runs will be autumatically removed from the system if left
                                unacknowledged. <a>Learn More.</a>
                              </Text>
                            </TextContent>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="link"
                          isInline
                          onClick={() => this.navigateToExpiringResult()}
                        >
                          View all warnings
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <Card className={expanded ? styles.savedRunCard : styles.savedRunCardExpanded}>
                <div className={styles.paddingBig}>
                  <TextContent>
                    <Text component={TextVariants.h3}>
                      {' '}
                      Saved Runs
                      <span style={{ paddingLeft: '10px' }}>
                        <Label href="#filled" style={{ fontSize: 'x-small', color: 'gray' }}>
                          {savedData.length} runs
                        </Label>{' '}
                      </span>
                      <span style={{ float: 'right' }}>
                        <Button onClick={() => this.navigateToExpiringResult()} variant="secondary">
                          Go to all runs
                        </Button>
                      </span>
                    </Text>
                  </TextContent>
                </div>
                <div>
                  <div className={styles.paddingSmall}>
                    {savedData.length > 0 ? (
                      <Table
                        onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                        columns={savedDataColumns}
                        onRowClick={record => {
                          this.retrieveResults(record);
                        }}
                        data={savedData}
                        saveRuns={selectedRowIds => this.saveRuns(null, selectedRowIds)}
                        removeResultFromSeen={(e, selectedRowIds) =>
                          this.removeResultFromSeen(e, selectedRowIds)
                        }
                        favoriteResult={selectedRowIds => {
                          this.favoriteResult(selectedRowIds);
                        }}
                        deleteResult={selectedRowIds =>
                          this.handleModalToggle(null, selectedRowIds)
                        }
                        isCheckable
                      />
                    ) : (
                      <div className={styles.centertext} style={{ marginTop: '8vh' }}>
                        <FontAwesomeIcon
                          color="gray"
                          icon={faStopwatch}
                          className={styles.stopwatchIcon}
                        />
                        <TextContent>
                          <Text component={TextVariants.h3}> You have no saved runs</Text>
                          <Text component={TextVariants.p}>
                            Runs that you have saved will appear here. These runs will be
                            autumatically removed from the system if left unacknowledged.{' '}
                            <a>Learn More.</a>
                          </Text>
                        </TextContent>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </GridItem>
            <GridItem>
              <Card className={styles.newRunCard}>
                <div className={styles.paddingSmall}>
                  <TextContent>
                    <Text component={TextVariants.h3}>
                      {' '}
                      New and unmanaged Runs
                      <span style={{ paddingLeft: '10px' }}>
                        <Label href="#filled" style={{ fontSize: 'x-small', color: 'gray' }}>
                          {newData.length} runs
                        </Label>{' '}
                      </span>
                      <span style={{ float: 'right' }}>
                        <Button
                          variant="link"
                          icon={<UndoAltIcon />}
                          onClick={() => this.fetchRunResult()}
                        >
                          Refresh results
                        </Button>
                      </span>
                    </Text>
                  </TextContent>
                </div>
                <div className={styles.newRunTable}>
                  <div className={styles.paddingBig}>
                    <Table
                      onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                      columns={newDataColumns}
                      onRowClick={record => {
                        this.retrieveResults(record);
                      }}
                      data={newData}
                      saveRuns={selectedRowIds => this.saveRuns(null, selectedRowIds)}
                      removeResultFromSeen={selectedRowIds =>
                        this.removeResultFromSeen(null, selectedRowIds)
                      }
                      favoriteResult={selectedRowIds => {
                        this.favoriteResult(selectedRowIds);
                      }}
                      deleteResult={selectedRowIds => this.handleModalToggle(null, selectedRowIds)}
                      isCheckable
                    />
                  </div>
                </div>
              </Card>
            </GridItem>
          </Grid>
        </Grid>
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
      </div>
    );
  }
}

export default Overview;
