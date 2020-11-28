import request from '../utils/request';

const { endpoints } = process.env;

export default async function queryMonthIndices() {
  const endpoint = `${endpoints.elasticsearch}/_aliases`;

  return request.get(endpoint);
}
