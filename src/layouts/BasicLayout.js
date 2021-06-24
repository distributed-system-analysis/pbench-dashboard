import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { getDvaApp } from 'umi';
import GlobalHeader from '@/components/GlobalHeader';
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
} from '@patternfly/react-core';
import NavigationDrawer from '../components/NavigationDrawer';
import LoginHint from '../components/LoginHint';

@connect(({ sessions, loading, auth }) => ({
  sessionBannerVisible: sessions.sessionBannerVisible,
  sessionDescription: sessions.sessionDescription,
  sessionId: sessions.sessionId,
  savingSession: loading.effects['sessions/saveSession'],
  username: auth.username,
  errorMessage: auth.errorMessage,
}))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    routes: PropTypes.array,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const app = getDvaApp();
    this.persistor = persistStore(app._store);

    this.state = {
      sessionExitModalVisible: false,
    };
  }

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
      children,
      location: { pathname },
      username,
      errorMessage,
    } = this.props;

    const { sessionExitModalVisible } = this.state;

    return (
      <React.Fragment>
        <DocumentTitle title="Pbench Dashboard">
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
              {children}
            </PersistGate>
          </Page>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default BasicLayout;
