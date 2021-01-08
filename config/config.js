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
  lessLoader: {
    javascriptEnabled: true,
  },
  routes: pageRoutes,
};
