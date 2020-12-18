import request from '../utils/request';

const { endpoints } = window;

export default async function queryMonthIndices() {
  const endpoint = `${endpoints.pbench_server}/controllers/months`;

  return request.get(endpoint);
}
