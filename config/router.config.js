module.exports = [
  {
    path: '/auth',
    component: '../components/AuthLayout',
  },
  {
    path: '/login',
    component: 'LoginHandler',
  },
  {
    path: '/signup',
    component: 'SignupHandler',
  },
  {
    path: '/password',
    component: 'PasswordHandler',
  },
  {
    path: '/share/:id',
    component: 'SessionPlaceholder',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        component: 'Controllers',
      },
      {
        path: '/controllers',
        component: 'Controllers',
      },
      {
        path: '/controllers/:controller',
        component: 'Results',
      },
      {
        path: '/controllers/:controller/:result/summary',
        component: 'Summary',
      },
      {
        path: '/comparison-select/',
        component: 'ComparisonSelect',
      },
      {
        path: '/comparison',
        component: 'RunComparison',
      },
      {
        path: '/search',
        component: 'Search',
      },
      {
        path: '/sessions',
        component: 'Sessions',
      },
      {
        path: '/overview',
        component: 'Overview',
      },
      {
        path: '/profile',
        component: 'Profile',
      },
      {
        path: '/exception/403',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        component: './Exception/500',
      },
    ],
  },
];
