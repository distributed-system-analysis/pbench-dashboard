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
import { connect } from 'dva';
import pbenchLogo from '../../assets/pbench_logo.svg';
import imgAvatar from '../../assets/avatar.svg';
import SessionModal from '../SessionModal';

@connect(({ auth }) => ({
  username: auth.username,
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

  logoutUser = () => {
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
    const { savingSession, dispatch, username } = this.props;
    const { isProfileDropdownOpen } = this.state;

    const profileDropdownItems = [
      <DropdownItem onClick={() => this.navigateToProfile()}>Profile</DropdownItem>,
      <DropdownItem onClick={() => this.logoutUser()}>Logout</DropdownItem>,
    ];

    const PageToolbar = (
      <PageHeaderTools>
        <SessionModal savingSession={savingSession} dispatch={dispatch} />
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
          {username ? (
            <PageHeaderToolsGroup>
              <PageHeaderToolsItem>
                <Dropdown
                  isPlain
                  position="right"
                  onSelect={this.onDropdownSelect}
                  isOpen={isProfileDropdownOpen}
                  toggle={
                    <DropdownToggle onToggle={this.onProfileDropdownToggle}>
                      {username}
                    </DropdownToggle>
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
