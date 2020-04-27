import React, { Component, Fragment } from 'react';
import { Grid, GridItem, Button, Title } from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';

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

  navigateToSignup = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  render() {
    const { children, user } = this.props;
    // Basic Login methods
    const PbenchMethods = (
      <Grid gutter="md" className={styles.section}>
        <GridItem>
          <Button
            isBlock
            variant="primary"
            onClick={() => this.navigateToLogin('login')}
            className={styles.btn}
          >
            <Title headingLevel="h4" size="xl" style={{ color: 'white' }}>
              Pbench credentials
            </Title>
          </Button>
        </GridItem>
      </Grid>
    );

    const restLoginHandlers = (
      <Grid gutter="md" className={styles.restLoginDiv}>
        <GridItem>
          <Title headingLevel="h4" size="xl">
            Need an account?
            <Button
              variant="link"
              onClick={() => this.navigateToSignup('signup')}
              className={styles.inlineLink}
            >
              signup
            </Button>
          </Title>
        </GridItem>
        <GridItem>
          <Title headingLevel="h4" size="xl">
            <Button variant="link" className={styles.inlineLink}>
              Forgot your password?
            </Button>
          </Title>
        </GridItem>
      </Grid>
    );

    const loginMethods = (
      <Grid gutter="md" className={styles.section}>
        <Title headingLevel="h4" size="xl">
          Or log in with ...
        </Title>
        <GridItem>
          <Button
            isBlock
            variant="secondary"
            onClick={() => this.navigateToLogin('ssoLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>Red Hat SSO</p>
          </Button>
        </GridItem>
        <GridItem>
          <Button
            isBlock
            variant="secondary"
            onClick={() => this.navigateToLogin('githubLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>GitHub</p>
          </Button>
        </GridItem>
        <GridItem>
          <Button
            isBlock
            variant="secondary"
            onClick={() => this.navigateToLogin('gmailLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>Gmail</p>
          </Button>
        </GridItem>
      </Grid>
    );
    const toPreview = (
      <Fragment>
        {PbenchMethods}
        {restLoginHandlers}
        {loginMethods}
      </Fragment>
    );

    if (user.user.username) {
      return <Fragment>{children}</Fragment>;
    }
    return <AuthLayout toPreview={toPreview} heading="Login With .." />;
  }
}
export default PrivateRoute;
