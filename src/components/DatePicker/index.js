import React, { Component, Fragment } from 'react';
import { Badge, DropdownItem, DropdownPosition } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import moment from 'moment';

import Calendar from '../Calendar/index';
import PFDropdown from '../Dropdown';

// DatePicker component is the default class
// that manages the dropdown as well as the calendar
// component.
export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment(),
    };
  }

  // Explicitely disables the
  // icon on a dropdown, which
  // is defaulted to a CaretIcon.
  // <@https://www.patternfly.org/v4/documentation/react/components/dropdown#props>
  componentDidMount() {
    const pfIcons = document.querySelectorAll('.pf-c-dropdown__toggle-icon');
    if (pfIcons) {
      Array.from(pfIcons).forEach(element => {
        const el = element;
        el.style.display = 'none';
      });
    }
  }

  // Updates the current dropdown
  // component.
  updateDropDown = (s, e) => {
    this.setState({ startDate: s, endDate: e });
  };

  // Sets the aggregated date range.
  setAggregatedTimeRange = message => {
    let newStartDate;
    let newEndDate;
    switch (message) {
      case 'day':
        newStartDate = moment();
        newEndDate = moment();
        break;
      default:
        newStartDate = moment().subtract(1, message);
        newEndDate = moment();
        break;
    }
    // Update the parent component.
    const { updateDate } = this.props;
    // updates the current state.
    this.updateDropDown(newStartDate, newEndDate);
    // update the parent state.
    updateDate(newStartDate, newEndDate);
  };

  render() {
    const { startDate, endDate } = this.state;
    const { updateDate } = this.props;
    const calendar = [
      <Calendar
        key="calendar"
        updateDate={updateDate}
        updateDropDown={(s, e) => this.updateDropDown(s, e)}
      />,
    ];
    const aggregatedChoices = [
      <DropdownItem key="day" onClick={() => this.setAggregatedTimeRange('day')}>
        Last day
      </DropdownItem>,
      <DropdownItem key="week" onClick={() => this.setAggregatedTimeRange('week')}>
        Last week
      </DropdownItem>,
      <DropdownItem key="month" onClick={() => this.setAggregatedTimeRange('month')}>
        Last month
      </DropdownItem>,
    ];
    const selectedTimeRange = (
      <Fragment>
        <Badge isRead>{startDate.format('DD-MM-YYYY')}</Badge>
        <Badge isRead>{endDate.format('DD-MM-YYYY')}</Badge>
      </Fragment>
    );
    return (
      <Fragment>
        <PFDropdown
          dropdownItems={calendar}
          dropDownElement={selectedTimeRange}
          position={DropdownPosition.right}
        />
        <PFDropdown
          dropdownItems={aggregatedChoices}
          dropDownElement={<CaretDownIcon />}
          position={DropdownPosition.right}
        />
      </Fragment>
    );
  }
}
