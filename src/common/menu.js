import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: '/',
    routes: [
      {
        name: 'Results',
        path: '/private/results',
        routes: [
          {
            name: 'Summary',
            path: '/private/summary',
          },
          {
            name: 'Comparison Select',
            path: '/private/comparison-select',
            routes: [
              {
                name: 'Comparison',
                path: '/private/comparison',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Search',
    icon: 'search',
    path: '/private/search',
  },
  {
    name: 'Explore',
    icon: 'global',
    path: '/private/explore',
  },
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      result.routes = formatter(item.routes, `${parentPath}${item.path}`, item.authority);
    }
    return result;
  });
}

const getMenuData = () => formatter(menuData);
export default getMenuData;
