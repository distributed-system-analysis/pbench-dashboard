import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Title, Button } from '@patternfly/react-core';

@connect(({ store, auth }) => ({
  store,
  auth: auth.auth,
}))
class LoginHint extends Component {
  navigateToAuth = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/auth`));
  };

  render() {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#e7f1fa',
          border: '1px solid #bee1f4',
          boxShadow: 'rgba(3, 3, 3, 0.12) 0px 1px 2px 0px, rgba(3, 3, 3, 0.06) 0px 0px 2px 0px',
          display: 'flex',
        }}
      >
        <Title headingLevel="h4"> Want to see only metrics relevant to you? &nbsp; &nbsp;</Title>
        <Button variant="link" onClick={() => this.navigateToAuth()} isInline>
          Login or Create an account?
        </Button>
      </div>
    );
  }
}

export default LoginHint;
