import React, { Component, Fragment } from 'react';
import { Grid, GridItem, Button, Title } from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';

@connect(auth => ({
  username: auth.username,
}))
class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigate = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  render() {
    const { children, username } = this.props;
    const pbenchLogin = (
      <Grid gutter="md" className={styles.section}>
        <GridItem>
          <Button
            isBlock
            variant="primary"
            onClick={() => this.navigate('login')}
            className={styles.btn}
          >
            <Title headingLevel="h4" size="xl" style={{ color: 'white' }}>
              Pbench credentials
            </Title>
          </Button>
        </GridItem>
      </Grid>
    );

    const authForms = (
      <Grid gutter="md" className={styles.restLoginDiv}>
        <GridItem>
          <Title headingLevel="h4" size="xl">
            Need an account?
            <Button
              variant="link"
              onClick={() => this.navigate('signup')}
              className={styles.inlineLink}
              style={{ paddingLeft: '10px' }}
            >
              Sign up
            </Button>
          </Title>
        </GridItem>
        <GridItem>
          <Title headingLevel="h4" size="xl">
            <Button
              variant="link"
              className={styles.inlineLink}
              onClick={() => this.navigate('password')}
            >
              Forgot your password?
            </Button>
          </Title>
        </GridItem>
      </Grid>
    );

    const thirdPartyLogin = (
      <Grid gutter="md" className={styles.section}>
        <Title headingLevel="h4" size="xl">
          Or log in with ...
        </Title>
        <GridItem>
          <Button
            isBlock
            id="ssologin"
            variant="secondary"
            onClick={() => this.navigate('ssoLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>Red Hat SSO</p>
          </Button>
        </GridItem>
        <GridItem>
          <Button
            isBlock
            variant="secondary"
            onClick={() => this.navigate('githubLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>GitHub</p>
          </Button>
        </GridItem>
        <GridItem>
          <Button
            isBlock
            variant="secondary"
            onClick={() => this.navigate('gmailLogin')}
            className={styles.btn}
          >
            <p className={styles.inlineLink}>Gmail</p>
          </Button>
        </GridItem>
      </Grid>
    );
    const toPreview = (
      <Fragment>
        {pbenchLogin}
        {authForms}
        {thirdPartyLogin}
      </Fragment>
    );
    if (username === 'admin') {
      return <Fragment>{children}</Fragment>;
    }
    return <AuthLayout toPreview={toPreview} heading="Log in with ..." />;
  }
}
export default PrivateRoute;
