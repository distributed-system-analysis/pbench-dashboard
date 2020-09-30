import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import pathToRegexp from 'path-to-regexp';
import memoizeOne from 'memoize-one';
import deepEqual from 'lodash/isEqual';
import GlobalHeader from '@/components/GlobalHeader';
import { Page, Spinner } from '@patternfly/react-core';
import SiderMenu from '../components/SiderMenu';
import LoginHint from '../components/LoginHint';
import getMenuData from '../common/menu';

const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const getBreadcrumbNameMap = memoizeOne(menu => {
  const routerMap = {};
  const mergeMeunAndRouter = menuData => {
    menuData.forEach(menuItem => {
      if (menuItem.routes) {
        mergeMeunAndRouter(menuItem.routes);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  mergeMeunAndRouter(menu);
  return routerMap;
}, deepEqual);

@connect(({ global, datastore, loading, auth }) => ({
  datastoreConfig: datastore.datastoreConfig,
  sessionBannerVisible: global.sessionBannerVisible,
  sessionDescription: global.sessionDescription,
  sessionId: global.sessionId,
  savingSession: loading.effects['global/saveUserSession'],
  auth: auth.auth,
}))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    routes: PropTypes.array,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.breadcrumbNameMap = getBreadcrumbNameMap(getMenuData());
    // eslint-disable-next-line no-underscore-dangle
    this.persistor = persistStore(window.g_app._store);
  }

  getChildContext() {
    const { location } = this.props;
    const { route } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
      routes: route.routes,
    };
  }

  getPageTitle = pathname => {
    let currRouterData = null;
    // match params path
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    if (!currRouterData) {
      return 'Pbench Dashboard';
    }
    return `${currRouterData.name} - Pbench Dashboard`;
  };

  render() {
    const {
      datastoreConfig,
      savingSession,
      sessionBannerVisible,
      sessionDescription,
      sessionId,
      children,
      location: { pathname },
      auth,
    } = this.props;

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <Page
            header={
              <GlobalHeader
                datastoreConfig={datastoreConfig}
                savingSession={savingSession}
                sessionBannerVisible={sessionBannerVisible}
                sessionDescription={sessionDescription}
                sessionId={sessionId}
              />
            }
            sidebar={<SiderMenu location={pathname} />}
            isManagedSidebar
          >
            {auth.username === 'admin' ? '' : <LoginHint />}
            <PersistGate
              persistor={this.persistor}
              loading={
                <Spinner
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                />
              }
            >
              {children}
            </PersistGate>
          </Page>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default BasicLayout;
