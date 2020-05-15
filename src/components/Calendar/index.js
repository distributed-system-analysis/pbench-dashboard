import React, { Component } from 'react';
import moment from 'moment';

import styles from './index.less';

// Calendar component is the actual dropdown
// Calendar that picks a range of dates.
// TODO: Add aggregated date picks such
// as "This week", "This month", etc.
export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateObject: moment(),
      startDate: moment(),
      endDate: moment(),
    };
    this.changeMonth = this.changeMonth.bind(this);
    this.resetDate = this.resetDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  // Sets the state of the parent component
  // when it updates it's state.
  componentDidUpdate(prevProps, prevState) {
    const { startDate, endDate } = this.state;
    const { updateDate, updateDropDown } = this.props;
    // Update the parent component.
    if (startDate !== prevState.startDate) {
      updateDate(startDate, endDate);
      updateDropDown(startDate, endDate);
    }
    if (endDate !== prevState.endDate) {
      updateDate(startDate, endDate);
      updateDropDown(startDate, endDate);
    }
  }

  // Changes the month selection.
  changeMonth = month => {
    const { dateObject } = this.state;
    const newDateObject = dateObject.month(month);
    this.setState({
      dateObject: newDateObject,
    });
  };

  // Resets the dateObject.
  resetDate = () => {
    this.setState({ dateObject: moment() });
  };

  // When we change the date. (startDate and endDate)
  changeDate = date => {
    let { startDate, endDate } = this.state;
    if (
      startDate === null ||
      date.isBefore(startDate, 'day') ||
      !startDate.isSame(endDate, 'day')
    ) {
      startDate = moment(date);
      endDate = moment(date);
    } else if (date.isSame(startDate, 'day') && date.isSame(endDate, 'day')) {
      startDate = null;
      endDate = null;
    } else if (date.isAfter(startDate, 'day')) {
      endDate = moment(date);
    }
    this.setState({
      startDate,
      endDate,
    });
  };

  render() {
    const { dateObject, startDate, endDate } = this.state;
    // MonthNavigation component is for choosing calendar months.
    const MonthNavigation = ({ date, changeMonth, resetDate }) => {
      return (
        <nav className={styles.calendarNav}>
          <a onClick={() => changeMonth(date.month() - 1)}>&#8249;</a>
          <h1 onClick={() => resetDate()}>
            {date.format('MMMM')} <small>{date.format('YYYY')}</small>
          </h1>
          <a onClick={() => changeMonth(date.month() + 1)}>&#8250;</a>
        </nav>
      );
    };
    // MonthDays component represents each month in the calendar.
    const MonthDays = ({ date, startOfTheMonth, endOfTheMonth, onClick }) => {
      const thisDate = moment(date);
      const daysInMonth = moment(date).daysInMonth();
      const firstDayDate = moment(date).startOf('month');
      const previousMonth = moment(date).subtract(1, 'month');
      const previousMonthDays = previousMonth.daysInMonth();
      const nextsMonth = moment(date).add(1, 'month');
      const days = [];
      const labels = [];
      for (let i = 1; i <= 7; i += 1) {
        labels.push(
          <span key={i} className={styles.label}>
            {moment()
              .day(i)
              .format('ddd')}
          </span>
        );
      }

      for (let i = firstDayDate.day(); i > 1; i -= 1) {
        previousMonth.date(previousMonthDays - i + 2);

        days.push(
          <Day
            key={moment(previousMonth).format('DD MM YYYY')}
            onClick={d => onClick(d)}
            currentDate={date}
            date={moment(previousMonth)}
            startDay={startOfTheMonth}
            endDay={endOfTheMonth}
          />
        );
      }

      for (let i = 1; i <= daysInMonth; i += 1) {
        thisDate.date(i);
        days.push(
          <Day
            key={moment(thisDate).format('DD MM YYYY')}
            onClick={d => onClick(d)}
            currentDate={date}
            date={moment(thisDate)}
            startDay={startOfTheMonth}
            endDay={endOfTheMonth}
          />
        );
      }
      const daysCount = days.length;
      for (let i = 1; i <= 42 - daysCount; i += 1) {
        nextsMonth.date(i);
        days.push(
          <Day
            key={moment(nextsMonth).format('DD MM YYYY')}
            onClick={d => onClick(d)}
            currentDate={date}
            date={moment(nextsMonth)}
            startDay={startOfTheMonth}
            endDay={endOfTheMonth}
          />
        );
      }
      return (
        <nav className={styles.calendarDays}>
          {labels.concat()}
          {days.concat()}
        </nav>
      );
    };

    // A Day component represents each day of the calendar.
    const Day = ({ currentDate, date, startDay, endDay, onClick }) => {
      const className = [];
      if (moment().isSame(date, 'day')) {
        className.push(styles.active);
      }
      if (date.isSame(startDay, 'day')) {
        className.push(styles.start);
      }
      if (date.isBetween(startDay, endDate, 'day')) {
        className.push(styles.between);
      }
      if (date.isSame(endDay, 'day')) {
        className.push(styles.end);
      }
      if (!date.isSame(currentDate, 'month')) {
        className.push(styles.muted);
      }
      return (
        <span
          key={moment(currentDate).format('DD MM YY')}
          onClick={() => onClick(date)}
          className={className.join(' ')}
        >
          {date.date()}
        </span>
      );
    };

    return (
      <div className={styles.calendar}>
        <MonthNavigation
          date={dateObject}
          changeMonth={month => this.changeMonth(month)}
          resetDate={() => this.resetDate()}
        />
        <MonthDays
          onClick={date => this.changeDate(date)}
          date={dateObject}
          startOfTheMonth={startDate}
          endOfTheMonth={endDate}
        />
      </div>
    );
  }
}
