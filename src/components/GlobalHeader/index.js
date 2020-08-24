import { Component } from 'react';
import { routerRedux, Link } from 'dva/router';
import { Icon, Divider, Tooltip, Alert, Badge, Tag } from 'antd';
import { Dropdown, DropdownItem, DropdownToggle, Avatar } from '@patternfly/react-core';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import styles from './index.less';
import SessionModal from '../SessionModal';
import packageJSON from '../../../package.json';
import imgAvatar from '../../assets/avatar.svg';

@connect(({ store, auth }) => ({
  store,
  auth: auth.auth,
}))
class GlobalHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
    };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen,
    });
  };

  onDropdownSelect = () => {
    const { isDropdownOpen } = this.state;
    this.setState({
      isDropdownOpen: !isDropdownOpen,
    });
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  exitUserSession = () => {
    const { dispatch, store } = this.props;
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
  };

  navigateToProfile = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/profile`));
  };

  render() {
    const {
      collapsed,
      datastoreConfig,
      savingSession,
      sessionBannerVisible,
      sessionDescription,
      sessionId,
      isMobile,
      logo,
      dispatch,
      auth,
    } = this.props;

    const userDropdownItems = [
      <DropdownItem className={styles.dropedDiv} onClick={() => this.navigateToProfile()}>
        Profile
      </DropdownItem>,
      <DropdownItem className={styles.dropedDiv} onClick={() => this.logoutSession()}>
        Logout
      </DropdownItem>,
    ];

    const { isDropdownOpen } = this.state;

    return (
      <div>
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
        <div className={styles.header}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {isMobile && [
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" />
              </Link>,
              <Divider type="vertical" key="line" />,
            ]}
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </div>
          <div className={styles.right}>
            <Tooltip title="Version">
              <Tag>{packageJSON.version}</Tag>
            </Tooltip>
            <SessionModal
              datastoreConfig={datastoreConfig}
              savingSession={savingSession}
              sessionConfig={this.props.store}
              dispatch={dispatch}
            />
            <Tooltip
              title="Search"
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/search',
                  })
                );
              }}
            >
              <a className={styles.action}>
                <Icon type="search" />
              </a>
            </Tooltip>
            <Tooltip title="Help">
              <a
                target="_blank"
                href="https://docs.google.com/document/d/1W4-vUpMzClBxQmwODDG4WLENmHXrL-adf-5GOF-NYg8/edit"
                rel="noopener noreferrer"
                className={styles.action}
              >
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
            <Tooltip title="Feedback">
              <a
                target="_blank"
                className={styles.action}
                style={{ paddingRight: '30px' }}
                //padding to keep the tooltip pointing towards top. Otherwise the tooltip top rotates to opposite side.
                href="https://github.com/distributed-system-analysis/pbench-dashboard/issues/new"
              >
                <Icon type="message" />
              </a>
            </Tooltip>
            {auth.username === 'admin' ? <Avatar src={imgAvatar} alt="Avatar image" /> : 'Admin'}
            <Tooltip className={styles.profileOpt}>
              <Dropdown
                isPlain
                position="right"
                onSelect={this.onDropdownSelect}
                isOpen={isDropdownOpen}
                toggle={
                  <DropdownToggle onToggle={this.onDropdownToggle}>{auth.username}</DropdownToggle>
                }
                dropdownItems={userDropdownItems}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default GlobalHeader;
