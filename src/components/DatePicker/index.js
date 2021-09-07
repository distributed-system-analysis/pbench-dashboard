import React, { useState } from 'react';
import {
  Split,
  SplitItem,
  DatePicker,
  Button,
  isValidDate,
  yyyyMMddFormat,
} from '@patternfly/react-core';
import { connect } from 'dva';

const PFDatePicker = props => {
  const { dispatch, onChangeCallback } = props;
  const [from, setFrom] = useState('');

  const toValidator = date =>
    isValidDate(from) && date >= from
      ? ''
      : '"To" date must be greater than or equal to the "From" date';

  const onFromChange = (_str, date) => {
    setFrom(date);
  };

  const getDataOnChange = (fromDate, toDate) => {
    dispatch({
      type: 'global/updateSelectedDateRange',
      payload: {
        start: String(yyyyMMddFormat(fromDate)),
        end: String(yyyyMMddFormat(toDate)),
      },
    });
  };

  const onToChange = (_str, date) => {
    if (isValidDate(date)) {
      getDataOnChange(from, date);
    }
  };

  return (
    <>
      <Split style={{ marginBottom: '15px' }}>
        <SplitItem>
          <DatePicker onChange={onFromChange} aria-label="Start date" placeholder="YYYY-MM-DD" />
        </SplitItem>
        <SplitItem style={{ padding: '6px 12px 0 12px' }}>to</SplitItem>
        <SplitItem>
          <DatePicker
            onChange={onToChange}
            isDisabled={!isValidDate(from)}
            rangeStart={from}
            validators={[toValidator]}
            aria-label="End date"
            placeholder="YYYY-MM-DD"
          />
        </SplitItem>
        <SplitItem style={{ marginLeft: '8px' }}>
          <Button onClick={() => onChangeCallback()}>Filter</Button>
        </SplitItem>
      </Split>
    </>
  );
};

export default connect()(PFDatePicker);
