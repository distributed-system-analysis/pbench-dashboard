import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, Spin, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import GlobalHeader from '@/components/GlobalHeader';
import SiderMenu from '../components/SiderMenu';
import getMenuData from '../common/menu';
import logo from '../assets/pbench_logo.png';

const { Content, Header, Footer } = Layout;

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

const getBreadcrumbNameMap = menu => {
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
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

@connect(({ global, datastore, loading }) => ({
  datastoreConfig: datastore.datastoreConfig,
  collapsed: global.collapsed,
  sessionBannerVisible: global.sessionBannerVisible,
  sessionDescription: global.sessionDescription,
  sessionId: global.sessionId,
  savingSession: loading.effects['global/saveUserSession'],
}))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    routes: PropTypes.array,
    params: PropTypes.object,
  };

  state = {
    isMobile,
  };

  constructor(props) {
    super(props);
    this.getPageTitle = this.getPageTitle;
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

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
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

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    if (visible) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  render() {
    const {
      datastoreConfig,
      collapsed,
      savingSession,
      sessionBannerVisible,
      sessionDescription,
      sessionId,
      fetchingNotices,
      children,
      location: { pathname },
    } = this.props;
    const { isMobile: mb } = this.state;
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          menuData={getMenuData()}
          collapsed={collapsed}
          // eslint-disable-next-line no-restricted-globals
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              fetchingNotices={fetchingNotices}
              collapsed={collapsed}
              datastoreConfig={datastoreConfig}
              savingSession={savingSession}
              sessionBannerVisible={sessionBannerVisible}
              sessionDescription={sessionDescription}
              sessionId={sessionId}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content
            style={{
              margin: sessionBannerVisible ? '104px 24px 0' : '24px 24px 0',
              height: '100%',
            }}
          >
            <PersistGate
              persistor={this.persistor}
              loading={
                <Spin
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  spinning
                />
              }
            >
              {children}
            </PersistGate>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: 'github',
                  title: <Icon type="github" />,
                  href: 'https://github.com/distributed-system-analysis/pbench-dashboard/',
                  blankTarget: true,
                },
                {
                  key: 'PBench',
                  title: 'PBench',
                  href: 'https://github.com/distributed-system-analysis/pbench/',
                  blankTarget: true,
                },
              ]}
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle(pathname)}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default memo(BasicLayout);
