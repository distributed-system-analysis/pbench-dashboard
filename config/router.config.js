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
        name: 'dashboard',
        icon: 'dashboard',
        component: './Controllers',
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
        path: '/sessions',
        name: 'sessions',
        component: './Sessions',
      },
      {
        path: '/overview',
        name: 'overview',
        component: './Overview',
      },
      {
        path: '/profile',
        name: 'profile',
        component: './Profile',
      },
      {
        path: '/result',
        name: 'result',
        component: './Result',
      },
      {
        path: '/expiring-results',
        name: 'expiring-results',
        component: './ExpiringResults',
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
    ],
  },
];
