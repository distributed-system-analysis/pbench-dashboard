# Archived!

The `pbench-dashboard` repository has been archived and replaced by https://github.com/distributed-system-analysis/pbench/tree/main/dashboard.

Please file PRs and issues against https://github.com/distributed-system-analysis/pbench.

----

## Foreword

Pbench Dashboard is a web-based platform for consuming indexed performance benchmark data. The platform provides a consolidated view of benchmark data within tables, charts, and other powerful visualizations. Users are able to quickly navigate through benchmark data and tune analytics through comparison tools for in-depth analysis.

## Scaffolding

```bash
├── public
│   └── favicon.ico                 # favicon
├── mock
│   ├── api.js                      # mocked api
│   └── user.js                     # mocked user api
├── config
│   ├── config.js                   # webpack configuration
│   ├── router.config.js            # webpack routing configuration
│   └── endpoints.js                # api endpoint configuration
├── src
│   ├── assets                      # local static files
│   ├── common                      # common configurations (navigation, menu, etc.)
│   ├── components                  # component definitions
│   ├── layouts                     # common layouts
│   ├── models                      # redux models
│   ├── pages                       # app page components and templates
│   │   └── document.ejs            # HTML entry
│   ├── services                    # redux services
│   ├── e2e                         # e2e test definitions
│   ├── utils                       # utility scripts
│   ├── app.js                      # app theme configuration
│   ├── global.js                   # global imports
│   ├── global.less                 # global styling
│   └── polyfill.js                 # polyfill configuration
├── .eslintrc.js                    # js linting configuration
├── .gitignore
├── .prettierignore                 # code formatting ignore file
├── .prettierrc                     # code formatting configuration
├── .stylelintrc                    # style linting configuration
├── jsconfig.json                   # js compiler configuration
├── config.json.j2                  # template JSON configuration
├── package.json                    # project dependencies
├── README.md
└── LICENSE.ant-design-pro          # template license file
```

## Assets

Assets placed in the `public` directory are copied to the `dist` directory for reference in the generated `index.html` file during the build process.

Assets placed in the `src/assets/` directory are only referenced within component or layout definitions and are packaged in the generated `***.js` file during the build process.


## Installation

Install Dependencies

`yarn` is the default dependency manager used for installing and building the application.

```bash
$ yarn install
```

Start Development Server

```bash
$ yarn start
```

Start Mock Development Server
```bash
$ yarn start:mock
```

This will automatically open the application on [http://localhost:8000](http://localhost:8000).

## Local Development

Both the production and development builds of the dashboard require API endpoint configurations in order to query data from specific datastores.

`public/endpoints.js` contains references to datastores and metadata required to visualize data in the dashboard. Please reference the following example for required configuration fields:

```JavaScript
window.endpoints = {
  pbench_server: 'http://test_domain.com/api/v1',
  prefix: 'test_prefix.',
  result_index: 'vn.result-data-sample.',
  result_data_index: 'vn.result-data.',
  results: 'http://test_domain.com',
  run_index: 'vn.run-data.',
  run_toc_index: 'vn.run-toc.',
};
```

`public/endpoints.mock.js` contains references to the mocked environment. The dashboard will automatically intercept requests made to an external datastore when `pbench_server` is set to `window.origin`. Mocked responses defined in `mock/api.js` will be returned with every intercepted request. 

## Storage Config

Pbench Dashboard stores application data using local browser storage given an application key defined in `app.js`. To deploy multiple instances of the dashboard on the same domain, change the `appName` field to a unique value for each deployment. 

```JavaScript
const appName = 'dashboard';

const persistConfig = {
  timeout: 1000,
  key: appName,
  storage,
  blacklist: ['dashboard', 'search'],
};
```

## Requirements

Install yarn

```
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
dnf/yum install yarn
```

## Build

Build Application

```bash
$ yarn build
```

This will generate the `dist` folder in the root directory, which contains packaged files such as `***.js`, `***.css`, and `index.html`.

## Releases

The release targets, `yarn prerelease`, `yarn release-patch`, `yarn release-minor`, and `yarn release-major` leverage the `npm version` behavior of running the `preversion` and `version` scripts during the course of its execution.

The `preversion` script runs a set of tests to double check nothing is broken.  Then the `version` script is run which actually performs the build, which includes the auto-increment version string as provided by the `prerelease` and `release-*` targets.

We do not use the `npm version` feature of auto-tagging and commit of the `package.json` changes.

## UI Tests

Run All UI Unit Tests and E2E Tests

```bash
$ yarn test
```

This will run test cases for all files referenced with a `*.test.js` or `*.e2e.js` naming schema. 

In order to run the E2E tests you must have `google-chrome-stable` installed:

On Fedora do:
```
$ dnf install fedora-workstation-repositories
$ dnf config-manager --set-enabled google-chrome
$ dnf install google-chrome-stable
```

## Installing private packages with yarn and npm

If you are using npm packages to distribute common utilities across projects, the dashboard can be configured to pull private packages from an internal npm server. 

To enable pulling packages from different registries, populate the `.npmrc` and `.yarnrc` files at the root of the project with the following fields:

.npmrc 

```
registry=https://repository.example.com/repository/
cafile=example.crt
```

.yarnrc

```
registry "https://repository.example.com/repository/"
cafile example.crt
```

Please note that the `cafile` field is optional for registries that require Certificate Authority signing certificates. Example files (`example.npmrc` and `example.yarnrc`) have been included at the root of the project with the required fields and example values.

## Template

This application is based on v1 of Ant Design Pro which is a production-ready UI solution for admin interfaces. For more information regarding the foundation and template of the application, please visit [https://v1.pro.ant.design/docs/getting-started](https://v1.pro.ant.design/docs/getting-started).

For information regarding the library license, please reference the `LICENSE.ant-design-pro` file.
