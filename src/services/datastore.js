import request from '../utils/request';

const { endpoints } = window;

export default async function queryMonthIndices() {
  return request.get(endpoints.api.controllers_months);
}
