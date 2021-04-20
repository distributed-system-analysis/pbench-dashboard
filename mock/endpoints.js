export default {
  'GET /api/v1/endpoints': {
    api: {
      controllers_list: '/controllers/list',
      controllers_months: '/controllers/months',
      elasticsearch: '/elasticsearch',
      endpoints: '/endpoints',
      graphql: '/graphql',
      host_info: '/host_info',
      login: '/login',
      logout: '/logout',
      register: '/register',
      results: '/results',
      upload_ctrl: '/upload/ctrl/',
      user: '/user/',
    },
    identification: 'Pbench MOCK server 0.71.0-xxxxx',
    indices: {
      result_data_index: 'test.v5.result-data.',
      result_index: 'test.v5.result-data-sample.',
      run_index: 'test.v6.run-data.',
      run_toc_index: 'test.v6.run-toc.',
    },
  },
};
