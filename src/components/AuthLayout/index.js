import React, { Component, Fragment } from 'react';
import {
  Grid,
  GridItem,
  Title,
  Flex,
  FlexItem,
  Button,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { connect } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import logo from '../../assets/white.svg';

@connect(({ user, error }) => ({
  user: user.user,
  errorMessage: error.errorMessage,
  successMessage: error.successMessage,
}))
class AuthLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  onSelect = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  navigateToLogin = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/auth`));
  };

  navigate = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  closeErrorAlert = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'error/clearAlertMessage',
      payload: {
        type: 'error',
      },
    });
  };

  closeSuccessAlert = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'error/clearAlertMessage',
      payload: {
        type: 'success',
      },
    });
  };

  render() {
    let { heading } = this.props;
    const { backOpt, toPreview, errorMessage, successMessage } = this.props;
    const back = (
      <Button
        id="backBtn"
        variant="link"
        icon={<FontAwesomeIcon icon={faAngleLeft} />}
        className={styles.inlineLink}
        style={{ padding: '0 0 20px 5px' }}
        onClick={() => this.navigateToLogin()}
      >
        Back
      </Button>
    );
    const Heading = (
      <div>
        <Title headingLevel="h2" size="3xl" className={styles.section}>
          {backOpt === 'true' ? back : <Fragment />}
          <br />
          {heading === undefined ? (heading = 'login with...') : heading}
        </Title>
      </div>
    );
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
            >
              Sign up
            </Button>
          </Title>
        </GridItem>
        <GridItem>
          <Title headingLevel="h6" size="lg">
            <Button variant="link" onClick={() => this.navigate('password')}>
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
    const authPreview = (
      <Fragment>
        {pbenchLogin}
        {authForms}
        {thirdPartyLogin}
      </Fragment>
    );

    return (
      <div>
        <div className="pf-c-background-image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pf-c-background-image__filter"
            width="0"
            height="0"
          >
            <filter id="image_overlay">
              <feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0" />
              <feComponentTransfer colorInterpolationFilters="sRGB" result="duotone">
                <feFuncR type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncG type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncB type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncA type="table" tableValues="0 1" />
              </feComponentTransfer>
            </filter>
          </svg>
        </div>
        <Grid className={styles.mainDiv}>
          <GridItem
            sm={8}
            md={4}
            lg={4}
            smOffset={1}
            mdOffset={1}
            lgOffset={1}
            className={styles.form}
          >
            {Heading}
            {errorMessage && (
              <AlertGroup isToast>
                <Alert
                  title={errorMessage}
                  variant="danger"
                  actionClose={<AlertActionCloseButton onClose={() => this.closeErrorAlert()} />}
                />
              </AlertGroup>
            )}
            {successMessage && (
              <AlertGroup isToast>
                <Alert
                  title={successMessage}
                  variant="success"
                  actionClose={<AlertActionCloseButton onClose={() => this.closeSuccessAlert()} />}
                />
              </AlertGroup>
            )}
            {toPreview || authPreview}
            <div className={styles.section}>
              Want to continue without login? Click <space />
              <Button
                variant="link"
                className={styles.continueBtn}
                onClick={() => this.navigate('')}
              >
                here
              </Button>
            </div>
          </GridItem>
          <GridItem
            sm={11}
            md={5}
            lg={5}
            smOffset={9}
            mdOffset={6}
            lgOffset={6}
            className={styles.sideGrid}
          >
            <div>
              <img src={logo} alt="pbench_logo" className={styles.logo} />
            </div>
            <div className={styles.sideGridItem}>
              <Title headingLevel="h4" size="xl">
                Pbench is a harness that allows data collection from a variety of tools while
                running a benchmark. Pbench has some built-in script that run some common
                benchmarks.
              </Title>
            </div>
            <div className={styles.sideGridItem}>
              <Flex>
                <FlexItem>
                  <h4>Terms of Use</h4>
                </FlexItem>
                <FlexItem>
                  <h4>Help</h4>
                </FlexItem>
                <FlexItem>
                  <h4>Privacy Policy</h4>
                </FlexItem>
              </Flex>
            </div>
          </GridItem>
        </Grid>
      </div>
    );
  }
}

export default AuthLayout;
