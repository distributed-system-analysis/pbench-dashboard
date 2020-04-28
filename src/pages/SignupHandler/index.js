import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { CheckIcon, CloseIcon } from '@patternfly/react-icons';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';

@connect(user => ({
  user: user.user,
}))
class SignupHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confPassword: '',
      email: '',
      variantVal: 'tertiary',
      btnColor: 'black',
    };
  }

  enableSubmitBtn = () => {
    this.setState({
      variantVal: 'primary',
      btnColor: 'white',
    });
    const btn = document.getElementById('submitBtn');
    btn.removeAttribute('disabled');
  };

  disableSubmitBtn = () => {
    this.setState({
      variantVal: 'tertiary',
      btnColor: 'black',
    });
    const btn = document.getElementById('submitBtn');
    btn.setAttribute('disabled', '');
  };

  handleNameInputChange = username => {
    const { email, password, confPassword } = this.state;
    this.setState({
      username,
    });
    if (username !== '' && email !== '' && password !== '' && confPassword !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
  };

  handleEmailInputChange = email => {
    const { username, password, confPassword } = this.state;
    this.setState({
      email,
    });
    if (username !== '' && email !== '' && password !== '' && confPassword !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
  };

  handlePassWordInputChange = password => {
    const { username, email, confPassword } = this.state;
    this.setState({
      password,
    });
    if (username !== '' && email !== '' && password !== '' && confPassword !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
    if (password.length >= 8) {
      document.getElementById('charLength').childNodes[0].style.display = 'none';
      document.getElementById('charLength').childNodes[1].style.display = 'block';
    } else {
      document.getElementById('charLength').childNodes[1].style.display = 'none';
      document.getElementById('charLength').childNodes[0].style.display = 'block';
    }
    const specRegex = /^[A-Za-z0-9 ]+$/;
    if (!specRegex.test(password) && password !== '') {
      document.getElementById('specialChar').childNodes[0].style.display = 'none';
      document.getElementById('specialChar').childNodes[1].style.display = 'block';
    } else {
      document.getElementById('specialChar').childNodes[1].style.display = 'none';
      document.getElementById('specialChar').childNodes[0].style.display = 'block';
    }
    const hasNumber = /\d/;
    if (hasNumber.test(password)) {
      document.getElementById('number').childNodes[0].style.display = 'none';
      document.getElementById('number').childNodes[1].style.display = 'block';
    } else {
      document.getElementById('number').childNodes[1].style.display = 'none';
      document.getElementById('number').childNodes[0].style.display = 'block';
    }
    const upperCase = /[A-Z]/;
    if (upperCase.test(password)) {
      document.getElementById('upperCaseChar').childNodes[0].style.display = 'none';
      document.getElementById('upperCaseChar').childNodes[1].style.display = 'block';
    } else {
      document.getElementById('upperCaseChar').childNodes[1].style.display = 'none';
      document.getElementById('upperCaseChar').childNodes[0].style.display = 'block';
    }
  };

  checkConfirmPassword = newpassword => {
    const { username, email } = this.state;
    const password = document.getElementById('horizontal-form-password').value;
    if (password !== newpassword) {
      document.getElementById('passwordStatus').innerHTML = 'Passwords do not match';
    } else {
      if (username !== '' && email !== '' && password !== '' && newpassword !== '') {
        this.enableSubmitBtn();
      } else {
        this.disableSubmitBtn();
      }
      document.getElementById('passwordStatus').innerHTML = '';
    }
  };

  handleSignupSubmit = () => {
    const { dispatch } = this.props;
    const { username, password } = this.state;
    this.setState({
      password,
      username,
    });
    dispatch(routerRedux.push(`/login`));
  };

  render() {
    const { variantVal, btnColor } = this.state;

    const form = (
      <Form className={styles.section}>
        <FormGroup label="First name" isRequired fieldId="horizontal-form-first-name">
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-first-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={this.handleNameInputChange}
          />
        </FormGroup>
        <FormGroup label="Last name" fieldId="horizontal-form-last-name">
          <TextInput
            type="text"
            id="horizontal-form-last-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
          />
        </FormGroup>
        <FormGroup label="Email address" isRequired fieldId="horizontal-form-email">
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-email"
            aria-describedby="horizontal-form-email-helper"
            name="horizontal-form-name"
            onChange={this.handleEmailInputChange}
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
        <FormGroup label="Confirm password" isRequired fieldId="horizontal-form-password">
          <TextInput
            isRequired
            type="password"
            id="horizontal-form-confirm-password"
            name="horizontal-form-confirm-password"
            onChange={this.checkConfirmPassword}
          />
        </FormGroup>
        <p style={{ color: 'red' }} id="passwordStatus" />
        <div id="passworkCheck">
          <h1>Password must contain atlest</h1>
          <Split id="charLength">
            <SplitItem style={{ marginTop: '2px' }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: 'none' }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              8 characters
            </SplitItem>
          </Split>
          <Split id="specialChar">
            <SplitItem style={{ marginTop: '2px' }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: 'none' }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 special character (!,/,@,#,$,%,?)
            </SplitItem>
          </Split>
          <Split id="number">
            <SplitItem style={{ marginTop: '2px' }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: 'none' }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 number
            </SplitItem>
          </Split>
          <Split id="upperCaseChar">
            <SplitItem style={{ marginTop: '2px' }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: 'none' }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 upercase letter
            </SplitItem>
          </Split>
        </div>
        <ActionGroup>
          <Button
            isBlock
            variant={variantVal}
            onClick={() => this.handleSignupSubmit()}
            className={styles.btn}
            id="submitBtn"
            isDisabled
          >
            <Title headingLevel="h4" size="xl" style={{ color: btnColor }}>
              Create account
            </Title>
          </Button>
        </ActionGroup>
      </Form>
    );
    return <AuthLayout toPreview={form} heading="Create an account" backOpt="true" />;
  }
}

export default SignupHandler;
