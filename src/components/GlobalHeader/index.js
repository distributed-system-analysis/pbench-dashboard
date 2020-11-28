import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import {
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Avatar,
  Button,
  Brand,
  Dropdown,
  DropdownItem,
  DropdownToggle,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { Alert, Badge } from 'antd';
import { connect } from 'dva';
import pbenchLogo from '../../assets/pbench_logo.svg';
import imgAvatar from '../../assets/avatar.svg';
import SessionModal from '../SessionModal';

@connect(({ store, auth }) => ({
  store,
  auth: auth.auth,
}))
class GlobalHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProfileDropdownOpen: false,
    };
  }

  onProfileDropdownToggle = isDropdownOpen => {
    this.setState({
      isProfileDropdownOpen: isDropdownOpen,
    });
  };

  exitUserSession = () => {
    const { dispatch } = this.props;
    const sessionConfig = window.localStorage.getItem('persist:session');

    dispatch({
      type: 'global/exitUserSession',
    });
    dispatch({
      type: 'global/rehydrateSession',
      payload: JSON.parse(sessionConfig),
    });
    window.localStorage.removeItem('persist:session');
    dispatch(routerRedux.push('/'));
  };

  logoutSession = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth/logoutUser',
    });
    dispatch(routerRedux.push('/'));
  };

  navigateToProfile = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/private/profile`));
  };

  navigateToAuth = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/auth`));
  };

  render() {
    const {
      savingSession,
      sessionBannerVisible,
      sessionDescription,
      sessionId,
      dispatch,
      store,
      auth,
    } = this.props;
    const { isProfileDropdownOpen } = this.state;

    const profileDropdownItems = [
      <DropdownItem onClick={() => this.navigateToProfile()}>Profile</DropdownItem>,
      <DropdownItem onClick={() => this.logoutSession()}>Logout</DropdownItem>,
    ];

    const PageToolbar = (
      <PageHeaderTools>
        {sessionBannerVisible && (
          <Alert
            message={sessionDescription}
            type="info"
            description={`Session ID: ${sessionId}`}
            closeText="Exit Session"
            icon={<Badge status="processing" />}
            onClose={this.exitUserSession}
            banner
          />
        )}
        <SessionModal savingSession={savingSession} sessionConfig={store} dispatch={dispatch} />
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem>
            <Button
              variant="plain"
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/search',
                  })
                );
              }}
            >
              <SearchIcon />
            </Button>
          </PageHeaderToolsItem>
          {auth.username === 'admin' ? (
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                <Dropdown
                  isPlain
                  position="right"
                  onSelect={this.onDropdownSelect}
                  isOpen={isProfileDropdownOpen}
                  toggle={
                    <DropdownToggle onToggle={this.onProfileDropdownToggle}>Admin</DropdownToggle>
                  }
                  dropdownItems={profileDropdownItems}
                />
              </PageHeaderToolsItem>
            </PageHeaderToolsGroup>
          ) : (
            <Button variant="tertiary" onClick={() => this.navigateToAuth()}>
              Login
            </Button>
          )}
          <Avatar src={imgAvatar} alt="Avatar image" />
        </PageHeaderToolsGroup>
      </PageHeaderTools>
    );

    return (
      <PageHeader
        logo={<Brand src={pbenchLogo} style={{ height: 32 }} />}
        headerTools={PageToolbar}
        showNavToggle
      />
    );
  }
}

export default GlobalHeader;
