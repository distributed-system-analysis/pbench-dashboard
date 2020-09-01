module.exports = [
  {
    path: '/auth',
    name: 'auth',
    component: '../components/AuthLayout',
  },
  {
    path: '/login',
    name: 'login',
    component: './LoginHandler',
  },
  {
    path: '/signup',
    name: 'signup',
    component: './SignupHandler',
  },
  {
    path: '/password',
    name: 'password',
    component: './PasswordHandler',
  },
  {
    path: '/exception/403',
    name: 'exception-403',
    component: './Exception/403',
  },
  {
    path: '/exception/404',
    name: 'exception-404',
    component: './Exception/404',
  },
  {
    path: '/exception/500',
    name: 'exception-500',
    component: './Exception/500',
  },
  {
    path: '/share/:id',
    name: 'share',
    component: './SessionPlaceholder',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        name: 'publicview',
        component: './PublicView',
      },
      {
        path: '/private',
        Routes: ['./src/pages/PrivateRoute/index.js'],
        routes: [
          {
            path: '/private',
            name: 'dashboard',
            icon: 'dashboard',
            component: './Controllers',
          },
          {
            path: '/private/profile',
            name: 'profile',
            exact: true,
            component: './Profile',
          },
          {
            path: '/private/results',
            name: 'results',
            component: './Results',
          },
          {
            path: '/private/summary',
            name: 'summary',
            component: './Summary',
          },
          {
            path: '/private/comparison-select',
            name: 'comparison-select',
            component: './ComparisonSelect',
          },
          {
            path: '/private/comparison',
            name: 'comparison',
            component: './RunComparison',
          },
          {
            path: '/private/search',
            name: 'search',
            component: './Search',
          },
          {
            path: '/private/explore',
            name: 'explore',
            component: './Explore',
          },
        ],
      },
    ],
  },
];
