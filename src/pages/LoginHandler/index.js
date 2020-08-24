import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  ActionGroup,
  Button,
  Title,
} from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';

@connect(auth => ({
  auth: auth.auth,
}))
class LoginHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      variantVal: 'tertiary',
      btnColor: 'black',
      btnDisabled: 'true',
    };
  }

  componentDidMount = () => {
    this.disableSubmitBtn();
  };

  setLoggedIn = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth/loadUser',
      payload,
    });
    dispatch(routerRedux.push(`/`));
  };

  enableSubmitBtn = () => {
    this.setState({
      variantVal: 'primary',
      btnColor: 'white',
      btnDisabled: 'false',
    });
  };

  disableSubmitBtn = () => {
    this.setState({
      variantVal: 'tertiary',
      btnColor: 'black',
      btnDisabled: 'true',
    });
  };

  handleUserNameInputChange = username => {
    const { password } = this.state;
    this.setState({
      username,
    });
    if (password !== '' && username !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
  };

  handlePassWordInputChange = password => {
    const { username } = this.state;
    this.setState({
      password,
    });
    if (username !== '' && password !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
  };

  handleLoginSubmit = () => {
    const { username, password } = this.state;
    if (username === 'admin' && password === 'admin') {
      this.setLoggedIn({ username });
    } else {
      alert('Wrong username/password pair');
    }
  };

  render() {
    const { variantVal, btnColor, btnDisabled } = this.state;
    const form = (
      <div className={styles.section}>
        <Form>
          <FormGroup label="Email address" isRequired fieldId="horizontal-form-name">
            <TextInput
              isRequired
              type="text"
              id="horizontal-form-name"
              aria-describedby="horizontal-form-name-helper"
              name="horizontal-form-name"
              onChange={this.handleUserNameInputChange}
            />
          </FormGroup>
          <FormGroup label="Password" isRequired fieldId="horizontal-form-password">
            <TextInput
              isRequired
              type="password"
              id="horizontal-form-password"
              name="horizontal-form-password"
              onChange={this.handlePassWordInputChange}
            />
          </FormGroup>
          <FormGroup fieldId="remember-me">
            <Checkbox
              label="Keep me logged in"
              id="alt-form-checkbox-1"
              name="alt-form-checkbox-1"
              className={styles.check}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              isBlock
              variant={variantVal}
              onClick={() => this.handleLoginSubmit()}
              className={styles.btn}
              id="submitBtn"
              {...(btnDisabled === 'true' ? { isDisabled: 'true' } : {})}
            >
              <Title headingLevel="h4" size="xl" style={{ color: btnColor }}>
                Submit
              </Title>
            </Button>
          </ActionGroup>
        </Form>
      </div>
    );
    return <AuthLayout toPreview={form} heading="Log into your Pbench Acount" backOpt="true" />;
  }
}

export default LoginHandler;
