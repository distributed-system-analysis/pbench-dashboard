/* eslint-disable no-underscore-dangle */
import React from 'react';
import DocumentTitle from 'react-document-title';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import memoizeOne from 'memoize-one';
import deepEqual from 'lodash/isEqual';
import GlobalHeader from '@/components/GlobalHeader';
import { getDvaApp } from 'umi';
import pathToRegexp from 'path-to-regexp';
import {
  Page,
  Bullseye,
  Spinner,
  Alert,
  AlertActionLink,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Button,
  Modal,
  ModalVariant,
  AlertGroup,
  AlertActionCloseButton,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';
import NavigationDrawer from '../components/NavigationDrawer';
import LoginHint from '../components/LoginHint';
import getMenuData from '../common/menu';
import RenderBreadcrumb from '@/components/Breadcrumb';

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
@connect(({ sessions, loading, auth }) => ({
  sessionBannerVisible: sessions.sessionBannerVisible,
  sessionDescription: sessions.sessionDescription,
  sessionId: sessions.sessionId,
  savingSession: loading.effects['sessions/saveSession'],
  username: auth.username,
  errorMessage: auth.errorMessage,
}))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.breadcrumbNameMap = getBreadcrumbNameMap(getMenuData());
    // eslint-disable-next-line no-underscore-dangle
    const app = getDvaApp();
    this.persistor = persistStore(app._store);

    this.state = {
      sessionExitModalVisible: false,
      breadcrumb: {},
    };
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;
    let exactPath = {};
    Object.keys(this.breadcrumbNameMap).forEach(routeMap => {
      if (routeMap.endsWith(pathname)) {
        exactPath = this.breadcrumbNameMap[routeMap];
      }
    });
    this.setState({
      breadcrumb: exactPath,
    });
  }

  // When router data updates
  componentDidUpdate() {
    const {
      location: { pathname },
    } = this.props;
    let exactPath = {};
    Object.keys(this.breadcrumbNameMap).forEach(routeMap => {
      if (routeMap.endsWith(pathname)) {
        exactPath = this.breadcrumbNameMap[routeMap];
      }
    });
    this.setState({
      breadcrumb: exactPath,
    });
  }

  getPageTitle = () => {
    const currRouterData = null;
    if (!currRouterData) {
      return 'Pbench Dashboard';
    }
    return `${currRouterData.name} - Pbench Dashboard`;
  };

  exitSession = () => {
    const { dispatch } = this.props;
    const sessionConfig = window.localStorage.getItem('persist:session');

    dispatch({
      type: 'sessions/exitSession',
    });
    dispatch({
      type: 'global/rehydrateSession',
      payload: JSON.parse(sessionConfig),
    });
    window.localStorage.removeItem('persist:session');
    dispatch(routerRedux.push('/'));
    window.location.reload();
  };

  toggleSessionExitModal = () => {
    const { sessionExitModalVisible } = this.state;

    this.setState({
      sessionExitModalVisible: !sessionExitModalVisible,
    });
  };

  closeAlert = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth/removeErrorMessage',
      payload: '',
    });
  };

  render() {
    const {
      savingSession,
      sessionBannerVisible,
      sessionDescription,
      sessionId,
      location: { pathname },
      username,
      children,
      errorMessage,
    } = this.props;

    const { sessionExitModalVisible, breadcrumb } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <Page
            header={<GlobalHeader savingSession={savingSession} />}
            sidebar={<NavigationDrawer location={pathname} />}
            isManagedSidebar
          >
            {errorMessage && (
              <AlertGroup isToast>
                <Alert
                  title={errorMessage}
                  variant="danger"
                  actionClose={<AlertActionCloseButton onClose={() => this.closeAlert()} />}
                />
              </AlertGroup>
            )}
            {sessionBannerVisible && (
              <Alert
                variant="info"
                isInline
                title="Viewing Session"
                actionLinks={
                  <React.Fragment>
                    <AlertActionLink onClick={() => this.toggleSessionExitModal()}>
                      Exit Session
                    </AlertActionLink>
                  </React.Fragment>
                }
              >
                <DescriptionList
                  columnModifier={{
                    default: '2Col',
                  }}
                >
                  <DescriptionListGroup>
                    <DescriptionListTerm>ID</DescriptionListTerm>
                    <DescriptionListDescription>{sessionId}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Description</DescriptionListTerm>
                    <DescriptionListDescription>{sessionDescription}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </Alert>
            )}
            {username ? '' : <LoginHint />}
            <Modal
              variant={ModalVariant.small}
              title="Confirm session exit"
              isOpen={sessionExitModalVisible}
              onClose={this.sessionExitModalVisible}
              actions={[
                <Button key="submit" variant="primary" onClick={this.exitSession}>
                  Exit
                </Button>,
                <Button key="back" variant="link" onClick={this.toggleShareModal}>
                  Cancel
                </Button>,
              ]}
            />
            <PersistGate
              persistor={this.persistor}
              loading={
                <Bullseye>
                  <Spinner />
                </Bullseye>
              }
            >
              <PageSection style={{ paddingBottom: 0 }} variant={PageSectionVariants.light}>
                <RenderBreadcrumb context={breadcrumb} currLocation={pathname} />
              </PageSection>
              {children}
            </PersistGate>
          </Page>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default BasicLayout;
