import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import {
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Button,
  Brand,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { connect } from 'dva';
import pbenchLogo from '../../assets/pbench_logo.svg';
import SessionModal from '../SessionModal';

@connect(({ auth }) => ({
  username: auth.username,
}))
class GlobalHeader extends Component {
  render() {
    const { savingSession, dispatch } = this.props;

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
