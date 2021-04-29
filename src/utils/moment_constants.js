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
export function getAllMonthsWithinRange(endpoints, index, selectedDateRange) {
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
    if (index === endpoints.indices.result_index) {
      queryString += `${index + monthValue}-*,`;
    } else {
      queryString += `${index + monthValue},`;
    }
  });
  return queryString;
}

export const formatDate = (format, givenDate) => {
  switch (format) {
    case 'utc':
      return moment(givenDate).format();
    case 'without time':
      return moment(givenDate).format('Do MMMM YYYY');
    case 'with time':
      return moment(givenDate).format('Do MMMM YYYY, h:mm:ss a');
    default:
      return givenDate;
  }
};

export const getDiffDate = givenDate => {
  return moment(givenDate).fromNow();
};

export const getDiffDays = givenDate => {
  const futureDate = moment(givenDate);
  const currDate = moment(new Date());
  return futureDate.diff(currDate, 'days');
};
