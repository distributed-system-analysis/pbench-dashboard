import pageRoutes from './router.config';

export default {
  // Note: typeof(process.env.MOCK) === string
  define: {
    MOCK_UI: process.env.MOCK === 'true',
    ENDPOINT: 'http://localhost:8000/api/v1/endpoints',
  },
  dynamicImport: undefined,
  base: '/dashboard/',
  publicPath: '/',
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  routes: pageRoutes,
};
