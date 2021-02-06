import React, { useState, useEffect, Fragment } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { connect } from 'dva';
import { Form, FormGroup, TextInput, ActionGroup, Button, Title } from '@patternfly/react-core';
import styles from './index.less';
import { validateEmail, validatePassword } from '@/utils/validator';
import PasswordConstraints from '@/components/PasswordConstraints';

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

  const handleSignupSubmit = async () => {
    const { dispatch } = props;
    const response = await dispatch({
      type: 'auth/registerUser',
      payload: {
        firstName,
        lastName,
        username: firstName.toLowerCase(),
        password,
        email,
      },
    });
    console.log(response);
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
      <PasswordConstraints constraints={constraints} />
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
