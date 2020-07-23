import React, { Component, Fragment } from 'react';
import { DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './index.less';

const { RangePicker } = DatePicker;

@connect(({ global, datastore }) => ({
  indices: datastore.indices,
  selectedDateRange: global.selectedDateRange,
}))
class AntdDatePicker extends Component {
  static propTypes = {
    onChangeCallback: PropTypes.func,
  };

  static defaultProps = {
    onChangeCallback: () => {},
  };

  handleChange = (dates, dateStrings) => {
    const { dispatch, onChangeCallback } = this.props;
    dispatch({
      type: 'global/updateSelectedDateRange',
      payload: {
        start: dateStrings[0],
        end: dateStrings[1],
      },
    }).then(() => {
      onChangeCallback();
    });
  };

  // Since we have no data before or after a certain
  // time range, we need to refrain user from selecting
  // such dates in the date picker.
  disabledDate = current => {
    const { indices } = this.props;
    if (indices.length === 0) {
      return false;
    }
    if (current.isBefore(moment(indices[indices.length - 1]).startOf('month'))) {
      return true;
    }
    if (current.isAfter(moment().endOf('day'))) {
      return true;
    }
    return false;
  };

  render() {
    const { selectedDateRange } = this.props;
    return (
      <Fragment>
        <RangePicker
          separator="to"
          className={styles.picker}
          onChange={this.handleChange}
          value={[
            selectedDateRange.start ? moment(selectedDateRange.start) : moment().subtract(7, 'day'),
            selectedDateRange.end ? moment(selectedDateRange.end) : moment(),
          ]}
          disabledDate={this.disabledDate}
          size="default"
          ranges={{
            Today: [moment(), moment()],
            'Last week': [moment().subtract(7, 'day'), moment()],
            'Last month': [
              moment()
                .subtract(1, 'month')
                .startOf('month'),
              moment().startOf('month'),
            ],
          }}
        />
      </Fragment>
    );
  }
}

export default AntdDatePicker;
