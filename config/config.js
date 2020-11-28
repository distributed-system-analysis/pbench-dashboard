import pageRoutes from './router.config';
import endpoints from './endpoints';

export default {
  define: {
    'process.env.endpoints': endpoints,
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
