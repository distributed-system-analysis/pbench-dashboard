import React, { Component, Fragment } from 'react';
import { Grid, GridItem, Button } from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(user => ({
  user: user.user,
}))
class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigateToLogin = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  render() {
    const { children, user } = this.props;

    // Basic Login methods
    const loginMethods = (
      <Grid gutter="md" style={{ padding: '10px' }}>
        <GridItem>
          <Button isBlock variant="primary" onClick={() => this.navigateToLogin('login')}>
            Pbench credentials
          </Button>
        </GridItem>
        <GridItem>
          <Button isBlock variant="secondary" onClick={() => this.navigateToLogin('ssoLogin')}>
            Red Hat SSO
          </Button>
        </GridItem>
        <GridItem>
          <Button isBlock variant="secondary" onClick={() => this.navigateToLogin('githubLogin')}>
            GitHub
          </Button>
        </GridItem>
      </Grid>
    );

    if (user.user.username) {
      return <Fragment>{children}</Fragment>;
    }
    return <AuthLayout toPreview={loginMethods} action="Login" signOptHidden="false" />;
  }
}
export default PrivateRoute;
