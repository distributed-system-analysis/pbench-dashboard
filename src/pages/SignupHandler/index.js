import React, { useState, useEffect, Fragment } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { CheckIcon, CloseIcon } from '@patternfly/react-icons';
import { connect } from 'dva';
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
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { validateEmail, validatePassword } from '@/utils/validator';

const mapStateToProps = state => {
  const { auth } = state;
  return auth;
};

const SignupHandler = props => {
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    passwordConstraints: '',
    passwordConfirm: '',
  });
  const [constraints, setConstraints] = useState({
    passwordLength: 'unmet',
    passwordSpecialChars: 'unmet',
    passwordContainsNumber: 'unmet',
    passwordBlockLetter: 'unmet',
  });

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableSubmitBtn, setEnableSubmitButton] = useState(false);

  /* eslint-disable no-restricted-syntax */
  const validateForm = () => {
    // return early for null responses.
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      return false;
    }
    // check if no errors.
    for (const dep of Object.entries(errors)) {
      if (dep[1].length > 0) {
        return false;
      }
    }
    // check if all constraints are met.
    for (const ct of Object.entries(constraints)) {
      if (ct[1] !== 'met') {
        return false;
      }
    }
    // if we reach here, it means
    // we have covered all of the edge cases.
    return true;
  };

  useEffect(
    () => {
      if (validateForm()) {
        setEnableSubmitButton(true);
      } else {
        setEnableSubmitButton(false);
      }
    },
    [firstName, lastName, email, password, confirmPassword]
  );

  // We have certain constraints on the password.
  // Depending upon if these are met, we either display
  // or hide them.
  const getSplitDisplayProperty = (name, type) => {
    if (constraints[name] === 'met' && type === 'check') {
      return 'block';
    }
    if (constraints[name] === 'unmet' && type === 'close') {
      return 'block';
    }
    return 'none';
  };

  const handleFirstNameInputChange = val => {
    setFirstName(val);
  };

  const handleLastNameInputChange = val => {
    setLastName(val);
  };

  const handleEmailInputChange = val => {
    setEmail(val);
    // validate email.
    const validEmail = validateEmail(val);
    setErrors({
      ...errors,
      ...validEmail,
    });
  };

  const handlePasswordInputChange = val => {
    setPassword(val);
    const validPassword = validatePassword(val);
    setConstraints({
      ...constraints,
      ...validPassword,
    });
    // edge case where user deliberately
    // edits the password field, even when
    // confirm password is not empty.
    if (val === confirmPassword) {
      setErrors({ ...errors, passwordConfirm: '' });
    } else {
      setErrors({ ...errors, passwordConfirm: 'The above passwords do not match!' });
    }
  };

  const checkConfirmPassword = cfPassword => {
    setConfirmPassword(cfPassword);
    if (password !== cfPassword) {
      setErrors({ ...errors, passwordConfirm: 'The above passwords do not match!' });
    } else {
      setErrors({ ...errors, passwordConfirm: '' });
    }
  };

  const handleSignupSubmit = () => {
    const { dispatch } = props;
    dispatch(routerRedux.push('/login'));
  };

  const form = (
    <Form className={styles.section}>
      <FormGroup label="First name" isRequired fieldId="horizontal-form-first-name">
        <TextInput
          isRequired
          type="text"
          id="horizontal-form-first-name"
          aria-describedby="horizontal-form-name-helper"
          name="horizontal-form-name"
          onChange={handleFirstNameInputChange}
        />
      </FormGroup>
      <FormGroup label="Last name" fieldId="horizontal-form-last-name">
        <TextInput
          type="text"
          id="horizontal-form-last-name"
          aria-describedby="horizontal-form-name-helper"
          name="horizontal-form-name"
          onChange={handleLastNameInputChange}
        />
      </FormGroup>
      <FormGroup label="Email address" isRequired fieldId="horizontal-form-email">
        <TextInput
          isRequired
          type="text"
          id="horizontal-form-email"
          aria-describedby="horizontal-form-email-helper"
          name="horizontal-form-name"
          onChange={handleEmailInputChange}
        />
        <p className={styles.error}>{errors.email}</p>
      </FormGroup>
      <FormGroup label="Password" isRequired fieldId="horizontal-form-password">
        <TextInput
          isRequired
          type="password"
          id="horizontal-form-password"
          name="horizontal-form-password"
          onChange={handlePasswordInputChange}
        />
        <p className={styles.error}>{errors.passwordConstraints}</p>
      </FormGroup>
      <FormGroup label="Confirm password" isRequired fieldId="horizontal-form-confirm-password">
        <TextInput
          isRequired
          type="password"
          id="horizontal-form-confirm-password"
          name="horizontal-form-confirm-password"
          onChange={checkConfirmPassword}
        />
        <p className={styles.error}>{errors.passwordConfirm}</p>
      </FormGroup>
      <div>
        <h4>Password must contain at least</h4>
        <Split>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordLength', 'close'),
            }}
          >
            <CloseIcon style={{ color: 'red' }} />
          </SplitItem>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordLength', 'check'),
            }}
          >
            <CheckIcon style={{ color: 'green' }} />
          </SplitItem>
          <SplitItem isFilled style={{ marginLeft: '15px' }}>
            8 characters
          </SplitItem>
        </Split>
        <Split>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordSpecialChars', 'close'),
            }}
          >
            <CloseIcon style={{ color: 'red' }} />
          </SplitItem>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordSpecialChars', 'check'),
            }}
          >
            <CheckIcon style={{ color: 'green' }} />
          </SplitItem>
          <SplitItem isFilled style={{ marginLeft: '15px' }}>
            1 special character (!,/,@,#,$,%,?)
          </SplitItem>
        </Split>
        <Split>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordContainsNumber', 'close'),
            }}
          >
            <CloseIcon style={{ color: 'red' }} />
          </SplitItem>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordContainsNumber', 'check'),
            }}
          >
            <CheckIcon style={{ color: 'green' }} />
          </SplitItem>
          <SplitItem isFilled style={{ marginLeft: '15px' }}>
            1 number
          </SplitItem>
        </Split>
        <Split>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordBlockLetter', 'close'),
            }}
          >
            <CloseIcon style={{ color: 'red' }} />
          </SplitItem>
          <SplitItem
            style={{
              marginTop: '2px',
              display: getSplitDisplayProperty('passwordBlockLetter', 'check'),
            }}
          >
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
          onClick={handleSignupSubmit}
          id="submitBtn"
          {...(!enableSubmitBtn ? { isDisabled: true } : {})}
        >
          <Title headingLevel="h4" size="xl">
            Create account
          </Title>
        </Button>
      </ActionGroup>
    </Form>
  );
  return (
    <Fragment>
      <AuthLayout toPreview={form} heading="Create an account" backOpt="true" />
    </Fragment>
  );
};

export default connect(mapStateToProps)(SignupHandler);
