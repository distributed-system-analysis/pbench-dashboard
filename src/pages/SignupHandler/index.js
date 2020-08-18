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

@connect(({ datastore }) => ({
  datastoreConfig: datastore.datastoreConfig,
}))
class SignupHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      // eslint-disable-next-line react/no-unused-state
      confirmedPassword: '',
      submitButtonDisabled: true,
      submitButtonColor: 'black',
      passwordValidation: {
        charCount: false,
        specialCharCount: false,
        containsNumber: false,
        containsUppercaseLetter: false,
      },
      passwordValidationMessage: '',
      usernameValidationMessage: '',
    };
  }

  componentDidMount() {
    this.fetchDatastoreConfig();
  }

  fetchDatastoreConfig = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'datastore/fetchDatastoreConfig',
    });
  };

  registerUser = () => {
    const { dispatch, datastoreConfig } = this.props;
    const { firstName, lastName, username, password, confirmedPassword } = this.state;

    let validRegistration = true;
    const validEmailRegex = /\S+@\S+\.\S+/;

    if (!validEmailRegex.test(username)) {
      this.setState({ usernameValidationMessage: 'Please enter a valid email address' });
      validRegistration = false;
    } else {
      this.setState({ usernameValidationMessage: '' });
    }

    if (password !== confirmedPassword) {
      this.setState({ passwordValidationMessage: 'The password confirmation does not match' });
      validRegistration = false;
    } else {
      this.setState({ passwordValidationMessage: '' });
    }

    if (validRegistration) {
      dispatch({
        type: 'auth/registerUser',
        payload: { datastoreConfig, firstName, lastName, username, password },
      }).then(response => {
        if (
          response.errors !== undefined &&
          response.errors[0].message ===
            'A unique constraint would be violated on User. Details: Field name = username'
        ) {
          this.setState({
            usernameValidationMessage:
              'This email address is already registered. If it belongs to you, please log in or visit our account recovery page to get access to this account.',
          });
        } else {
          dispatch(routerRedux.push(`/login`));
        }
      });
    }
  };

  isFormFilled = () => {
    const {
      firstName,
      lastName,
      username,
      password,
      confirmedPassword,
      passwordValidation,
    } = this.state;

    const containsSpecialCharRegex = /^[A-Za-z0-9 ]+$/;
    const containsNumberRegex = /\d/;
    const containsUppercaseLetterRegex = /[A-Z]/;

    let validPassword = true;

    this.setState({
      passwordValidation: {
        charCount: password.length >= 8,
        specialCharCount: !containsSpecialCharRegex.test(password),
        containsNumber: containsNumberRegex.test(password),
        containsUppercaseLetter: containsUppercaseLetterRegex.test(password),
      },
    });

    Object.values(passwordValidation).forEach(validation => {
      if (validation === false) {
        validPassword = false;
      }
    });

    if (
      firstName !== '' &&
      lastName !== '' &&
      username !== '' &&
      password !== '' &&
      confirmedPassword !== '' &&
      validPassword === true
    ) {
      this.setState({
        submitButtonDisabled: false,
        submitButtonColor: 'white',
      });
    } else {
      this.setState({
        submitButtonDisabled: true,
        submitButtonColor: 'black',
      });
    }
  };

  onChangeFirstName = firstName => {
    this.setState({ firstName });
    this.isFormFilled();
  };

  onChangeLastName = lastName => {
    this.setState({ lastName });
    this.isFormFilled();
  };

  onChangeUsername = username => {
    this.setState({ username });
    this.isFormFilled();
  };

  onChangePassword = password => {
    this.setState({ password });
    this.isFormFilled();
  };

  onChangeConfirmedPassword = confirmedPassword => {
    this.setState({ confirmedPassword });
    this.isFormFilled();
  };

  render() {
    const {
      submitButtonDisabled,
      submitButtonColor,
      passwordValidation,
      passwordValidationMessage,
      usernameValidationMessage,
    } = this.state;

    const form = (
      <Form className={styles.section}>
        <FormGroup label="First Name" fieldId="firstName">
          <TextInput
            isRequired
            type="text"
            onChange={this.onChangeFirstName}
            aria-label="First Name"
          />
        </FormGroup>
        <FormGroup label="Last Name" fieldId="lastName">
          <TextInput
            isRequired
            type="text"
            onChange={this.onChangeLastName}
            aria-label="Last Name"
          />
        </FormGroup>
        <FormGroup label="Email Address" fieldId="emailAddress">
          <TextInput
            isRequired
            type="text"
            onChange={this.onChangeUsername}
            aria-label="Email Address"
          />
          <p className={styles.error}>{usernameValidationMessage}</p>
        </FormGroup>
        <FormGroup label="Password" fieldId="password">
          <TextInput
            isRequired
            type="password"
            onChange={this.onChangePassword}
            aria-label="Password"
          />
        </FormGroup>
        <FormGroup label="Confirm Password" fieldId="confirmPassword">
          <TextInput
            isRequired
            type="password"
            onChange={this.onChangeConfirmedPassword}
            aria-label="Confirm Password"
          />
          <p className={styles.error}>{passwordValidationMessage}</p>
        </FormGroup>
        <div>
          <h4>Password must contain at least</h4>
          <Split>
            {passwordValidation.charCount ? (
              <SplitItem style={{ marginTop: '2px' }}>
                <CheckIcon style={{ color: 'green' }} />
              </SplitItem>
            ) : (
              <SplitItem style={{ marginTop: '2px' }}>
                <CloseIcon style={{ color: 'red' }} />
              </SplitItem>
            )}
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              8 characters
            </SplitItem>
          </Split>
          <Split>
            {passwordValidation.specialCharCount ? (
              <SplitItem style={{ marginTop: '2px' }}>
                <CheckIcon style={{ color: 'green' }} />
              </SplitItem>
            ) : (
              <SplitItem style={{ marginTop: '2px' }}>
                <CloseIcon style={{ color: 'red' }} />
              </SplitItem>
            )}
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 special character (!,/,@,#,$,%,?)
            </SplitItem>
          </Split>
          <Split>
            {passwordValidation.containsNumber ? (
              <SplitItem style={{ marginTop: '2px' }}>
                <CheckIcon style={{ color: 'green' }} />
              </SplitItem>
            ) : (
              <SplitItem style={{ marginTop: '2px' }}>
                <CloseIcon style={{ color: 'red' }} />
              </SplitItem>
            )}
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 number
            </SplitItem>
          </Split>
          <Split>
            {passwordValidation.containsUppercaseLetter ? (
              <SplitItem style={{ marginTop: '2px' }}>
                <CheckIcon style={{ color: 'green' }} />
              </SplitItem>
            ) : (
              <SplitItem style={{ marginTop: '2px' }}>
                <CloseIcon style={{ color: 'red' }} />
              </SplitItem>
            )}
            <SplitItem isFilled style={{ marginLeft: '15px' }}>
              1 uppercase letter
            </SplitItem>
          </Split>
        </div>
        <ActionGroup>
          <Button
            isBlock
            onClick={() => this.registerUser()}
            className={styles.submitButton}
            isDisabled={submitButtonDisabled}
          >
            <Title headingLevel="h4" size="xl" style={{ color: submitButtonColor }}>
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
