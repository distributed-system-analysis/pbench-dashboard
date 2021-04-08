import { isUrl } from '../utils/utils';

const menuData = [
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
    name: 'Search',
    path: '/search',
  },
  {
    name: 'Sessions',
    path: '/sessions',
  },
];

// Generates a configuration of type { Path: Name }
// from menuData. A level is used to distinguish
// root paths from other paths.
function formatter(data, parentPath = '', parentName = '', level = 1) {
  return data.map(item => {
    let { path, name } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    // For all non root paths,
    // append the parent name with
    // current name.
    if (level !== 1) {
      name = `${parentName}/${name}`;
    }
    let result = {};
    if (item.routes) {
      result = {
        ...item,
        path,
        name,
      };
      result.routes = formatter(item.routes, `${parentPath}${item.path}`, name, level + 1);
    } else {
      result = {
        ...item,
        path,
        name,
      };
    }
    return result;
  });
}

const getMenuData = () => formatter(menuData);
export default getMenuData;
