import moment from 'moment';

// Default selections into the date
// range picker, one month till now.
export default function getDefaultDateRange(lastIndex) {
  return {
    start: moment(lastIndex)
      .subtract(1, 'month')
      .format('YYYY-MM-DD'),
    end: moment(lastIndex).format('YYYY-MM-DD'),
  };
}

// Gets all months within a specified date range
export function getAllMonthsWithinRange(datastoreConfig, index, selectedDateRange) {
  const startDate = moment(selectedDateRange.start);
  const endDate = moment(selectedDateRange.end);
  const referenceDate = startDate.clone();
  const monthResults = [];
  let queryString = '';
  if (startDate && endDate) {
    while (referenceDate.isBefore(endDate)) {
      monthResults.push(referenceDate.format('YYYY-MM'));
      referenceDate.add(1, 'month');
    }
  }
  if (referenceDate.month() === endDate.month()) {
    monthResults.push(referenceDate.format('YYYY-MM'));
  }
  monthResults.forEach(monthValue => {
    if (index === datastoreConfig.result_index) {
      queryString += `${datastoreConfig.prefix + index + monthValue}-*,`;
    } else {
      queryString += `${datastoreConfig.prefix + index + monthValue},`;
    }
  });
  return queryString;
}
