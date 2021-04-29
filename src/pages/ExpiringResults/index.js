import React, { Component } from 'react';
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
} from '@patternfly/react-core';
import { Icon } from 'antd';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { getDiffDays, getDiffDate } from '../../utils/moment_constants';
import Table from '@/components/Table';
import styles from './index.less';

const expirationLimit = { val: 30 };

@connect(({ global, user, dashboard }) => ({
  selectedDateRange: global.selectedDateRange,
  selectedControllers: global.selectedControllers,
  user: user.user,
  favoriteControllers: user.favoriteControllers,
  results: dashboard.results,
}))
class ExpiringResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalResultData: [],
    };
  }

  componentDidMount() {
    const { dispatch, selectedControllers, selectedDateRange, results } = this.props;
    const controller = selectedControllers[0];
    dispatch({
      type: 'dashboard/fetchResults',
      payload: {
        selectedDateRange,
        controller: selectedControllers,
      },
    }).then(() => {
      const totalResultData = results[controller];
      this.setState({
        totalResultData,
      });
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

  showDrowpdown = id => {
    const dropdownElem = document.getElementById(id);
    if (dropdownElem.style.display === 'none') {
      dropdownElem.style.display = 'block';
    } else {
      dropdownElem.style.display = 'none';
    }
  };

  render() {
    const { favoriteControllers } = this.props;
    const { totalResultData } = this.state;
    const seenDataColumns = [
      {
        Header: 'Result',
        accessor: 'result',
        Cell: cell => {
          const row = cell.row.original;
          return (
            <div>
              <Button
                variant="link"
                isInline
                style={{ marginBottom: '8px' }}
                onClick={() => this.navigateToRunResult(cell.row)}
              >
                {cell.value}
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
            <a onClick={e => this.favoriteRecord(e, null, row)}>
              <Icon type="star" />
            </a>
          );
        },
      },
      {
        title: '',
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
                  <div className={styles.dropdownLink}>Mark unread</div>
                  <div className={styles.dropdownLink} onClick={() => this.deleteResult(row)}>
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
        <div className={styles.paddingBig}>
          <TextContent className={styles.paddingSmall}>
            <Text component={TextVariants.h1}> All runs</Text>
          </TextContent>
          <Grid hasGutter style={{ marginTop: '16px' }}>
            <GridItem span={12}>
              <Card>
                <div>
                  <Table
                    columns={seenDataColumns}
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    data={totalResultData}
                  />
                </div>
              </Card>
            </GridItem>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default ExpiringResults;
