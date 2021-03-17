import pageRoutes from './router.config';

export default {
  define: {
    MOCK_UI: process.env.MOCK,
    ENDPOINTS_ENV: process.env.MOCK ? 'endpoints.mock.js' : 'endpoints.js',
  },
  dynamicImport: undefined,
  base: '/dashboard/',
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/dashboard/',
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  routes: pageRoutes,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
      },
    ],
  ],
};
