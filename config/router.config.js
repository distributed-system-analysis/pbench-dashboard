module.exports = [
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
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['./src/pages/PrivateRoute/index.js'],
    routes: [
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Controllers',
      },
      {
        path: '/profile',
        name: 'profile',
        component: './Profile',
      },
      {
        path: '/results',
        name: 'results',
        component: './Results',
      },
      {
        path: '/summary',
        name: 'summary',
        component: './Summary',
      },
      {
        path: '/comparison-select',
        name: 'comparison-select',
        component: './ComparisonSelect',
      },
      {
        path: '/comparison',
        name: 'comparison',
        component: './RunComparison',
      },
      {
        path: '/search',
        name: 'search',
        component: './Search',
      },
      {
        path: '/explore',
        name: 'explore',
        component: './Explore',
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
        path: '/system-comparisions',
        name: 'system-comparisons',
        component: './SystemComparisions',
      },
    ],
  },
];
