import pageRoutes from './router.config';

export default {
  // Note: typeof(process.env.MOCK) === string
  define: {
    MOCK_UI: process.env.MOCK === 'true',
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
