import request from '../utils/request';

export default async function queryMonthIndices() {
  return request.get(window.endpoints.api.controllers_months);
}
