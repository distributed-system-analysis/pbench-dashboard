/* eslint-disable no-underscore-dangle */
import React from 'react';
import DocumentTitle from 'react-document-title';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import memoizeOne from 'memoize-one';
import GlobalHeader from '@/components/GlobalHeader';
import { getDvaApp } from 'umi';
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
  PageSectionVariants,
} from '@patternfly/react-core';
import NavigationDrawer from '../components/NavigationDrawer';
import LoginHint from '../components/LoginHint';
import getMenuData from '../common/menu';
import RenderBreadcrumb from '@/components/Breadcrumb';

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
    this.breadcrumbNameMap = getMenuData();

    // eslint-disable-next-line no-underscore-dangle
    const app = getDvaApp();
    this.persistor = persistStore(app._store);

    this.state = {
      sessionExitModalVisible: false,
      breadcrumb: {},
      showLoginBanner: true,
    };
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;
    // find the current route from menuData.
    const currRouteMap = this.breadcrumbNameMap.find(route => route.path.endsWith(pathname));

    this.setState({
      breadcrumb: currRouteMap,
    });
  }

  // When router data updates
  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
    } = this.props;
    if (prevProps.location.pathname !== pathname) {
      // find the current route from menuData.
      const currRouteMap = this.breadcrumbNameMap.find(route => route.path.endsWith(pathname));

      this.setState({
        breadcrumb: currRouteMap,
      });
    }
  }

  closeLoginHint = () => {
    this.setState({
      showLoginBanner: false,
    });
  };

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

    const { sessionExitModalVisible, breadcrumb, showLoginBanner } = this.state;

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
            {username
              ? ''
              : showLoginBanner && <LoginHint closeLoginHint={() => this.closeLoginHint()} />}
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
              <PageSection
                style={showLoginBanner ? { paddingBottom: 0 } : { marginTop: 0, paddingBottom: 0 }}
                variant={PageSectionVariants.light}
              >
                {breadcrumb.parent && <RenderBreadcrumb context={breadcrumb} />}
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
