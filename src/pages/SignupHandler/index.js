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

@connect(auth => ({
  auth: auth.auth,
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
      btnDisabled: 'true',
      charLength: ['block', 'none'],
      specialChar: ['block', 'none'],
      number: ['block', 'none'],
      upperCaseChar: ['block', 'none'],
      passwordMatch: '',
      emailValidation: '',
    };
  }

  componentDidMount = () => {
    this.disableSubmitBtn();
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
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email) && email !== '') {
      this.setState({ emailValidation: 'Enter a valid Email' });
    } else {
      this.setState({ emailValidation: '' });
      if (username !== '' && email !== '' && password !== '' && confPassword !== '') {
        this.enableSubmitBtn();
      } else {
        this.disableSubmitBtn();
      }
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
      this.setState({ charLength: ['none', 'block'] });
    }
    const specRegex = /^[A-Za-z0-9 ]+$/;
    if (!specRegex.test(password) && password !== '') {
      this.setState({ specialChar: ['none', 'block'] });
    }
    const hasNumber = /\d/;
    if (hasNumber.test(password)) {
      this.setState({ number: ['none', 'block'] });
    }
    const upperCase = /[A-Z]/;
    if (upperCase.test(password)) {
      this.setState({ upperCaseChar: ['none', 'block'] });
    }
  };

  checkConfirmPassword = newpassword => {
    const { username, email, password } = this.state;
    if (password !== newpassword && newpassword !== '') {
      this.setState({ passwordMatch: "Password doesn't match" });
    } else {
      this.setState({ passwordMatch: '' });
      if (username !== '' && email !== '' && password !== '' && newpassword !== '') {
        this.enableSubmitBtn();
      } else {
        this.disableSubmitBtn();
      }
    }
  };

  handleSignupSubmit = () => {
    const { dispatch } = this.props;
    const { username, password, email } = this.state;
    this.setState({
      password,
      username,
      email,
    });
    dispatch(routerRedux.push(`/login`));
  };

  render() {
    const {
      variantVal,
      btnColor,
      btnDisabled,
      charLength,
      number,
      specialChar,
      upperCaseChar,
      passwordMatch,
      emailValidation,
    } = this.state;

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
          <p className={styles.error}>{emailValidation}</p>
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
          <p className={styles.error}>{passwordMatch}</p>
        </FormGroup>
        <div id="passworkCheck">
          <h4>Password must contain at least</h4>
          <Split>
            <SplitItem style={{ marginTop: '2px', display: charLength[0] }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: charLength[1] }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              8 characters
            </SplitItem>
          </Split>
          <Split>
            <SplitItem style={{ marginTop: '2px', display: specialChar[0] }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: specialChar[1] }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 special character (!,/,@,#,$,%,?)
            </SplitItem>
          </Split>
          <Split>
            <SplitItem style={{ marginTop: '2px', display: number[0] }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: number[1] }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 number
            </SplitItem>
          </Split>
          <Split>
            <SplitItem style={{ marginTop: '2px', display: upperCaseChar[0] }}>
              <CloseIcon style={{ color: 'red' }} />
            </SplitItem>
            <SplitItem style={{ marginTop: '2px', display: upperCaseChar[1] }}>
              <CheckIcon style={{ color: 'green' }} />
            </SplitItem>
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 uppercase letter
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
            {...(btnDisabled === 'true' ? { isDisabled: 'true' } : {})}
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
