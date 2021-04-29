import memoizeOne from 'memoize-one';

export const menuData = [
  {
    name: 'Dashboard',
    path: '/',
    routes: [
      {
        name: 'Results',
        path: '/results',
        routes: [
          {
            name: 'Summary',
            path: '/summary',
          },
          {
            name: 'Comparison Select',
            path: '/comparison-select',
            routes: [
              {
                name: 'Comparison',
                path: '/comparison',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Overview',
    icon: 'overview',
    path: '/overview',
    routes: [
      {
        name: 'Expiring Results',
        path: '/expiring-results',
      },
      {
        name: 'result',
        path: '/result',
      },
    ],
  },
  {
    name: 'Search',
    path: '/search',
  },
  {
    name: 'Sessions',
    path: '/sessions',
  },
];

const combinePaths = (parent, child) => `${parent.replace(/\/$/, '')}/${child.replace(/^\//, '')}`;

const buildPaths = (navigation, parentPath = '') =>
  navigation.map(route => {
    const path = combinePaths(parentPath, route.path);

    return {
      ...route,
      path,
      ...(route.routes && { routes: buildPaths(route.routes, path) }),
    };
  });

const setupParents = (routes, parentRoute = null) =>
  routes.map(route => {
    const withParent = {
      ...route,
      ...(parentRoute && { parent: parentRoute }),
    };

    return {
      ...withParent,
      ...(withParent.routes && {
        routes: setupParents(withParent.routes, withParent),
      }),
    };
  });

const flattenRoutes = routes =>
  routes.map(route => [route.routes ? flattenRoutes(route.routes) : [], route]).flat(Infinity);

const getMenuData = () => flattenRoutes(setupParents(buildPaths(menuData)));

export default memoizeOne(getMenuData);
