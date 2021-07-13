import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import AuthLayout from '@/components/AuthLayout';
import { Title, Form, FormGroup, TextInput, ActionGroup, Button } from '@patternfly/react-core';
import styles from './index.less';
import PasswordConstraints from '@/components/PasswordConstraints';
import { validatePassword } from '@/utils/validator';

const mapStateToProps = state => {
  const { auth } = state;
  return auth;
};

const PasswordRecovery = props => {
  const {
    location: { pathname },
  } = props;
  const token = pathname.split('/').pop();
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enableSubmitBtn, setEnableSubmitButton] = useState(false);
  const [constraints, setConstraints] = useState({
    passwordLength: 'unmet',
    passwordSpecialChars: 'unmet',
    passwordContainsNumber: 'unmet',
    passwordBlockLetter: 'unmet',
  });

  /* eslint-disable no-restricted-syntax */
  const validateForm = () => {
    // return early
    if (password.trim() === '' || confirmPassword.trim() === '') {
      return false;
    }
    // password constraints check.
    for (const ct of Object.entries(constraints)) {
      if (ct[1] === 'unmet') {
        return false;
      }
    }

    // return if any error is found
    for (const err of Object.entries(errors)) {
      if (err[1] !== '') {
        return false;
      }
    }

    // if we reach up to this point,
    // the form is validated.
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
    [password, confirmPassword]
  );

  const handlePasswordChange = val => {
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
      setErrors({ ...errors, confirmPassword: '' });
    } else {
      setErrors({ ...errors, confirmPassword: 'The above passwords do not match!' });
    }
  };

  const handleConfirmPasswordChange = cfPassword => {
    setConfirmPassword(cfPassword);
    if (cfPassword !== password) {
      setErrors({ ...errors, confirmPassword: 'The above passwords do not match' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const sendTempPasword = temporaryPassword => {
    const { dispatch } = props;
    dispatch({
      type: 'auth/recoverPassword',
      payload: {
        password,
        temporaryPassword,
      },
    });
  };

  const form = (
    <div className={styles.section}>
      <br />
      <Form>
        <FormGroup label="Password" isRequired fieldId="horizontal-form-password">
          <TextInput id="password" isRequired type="password" onChange={handlePasswordChange} />
          <p className={styles.error}>{errors.password}</p>
        </FormGroup>
        <FormGroup label="Confirm Password" isRequired fieldId="horizontal-form-confirm-password">
          <TextInput
            id="confirmPassword"
            isRequired
            type="password"
            onChange={handleConfirmPasswordChange}
          />
          <p className={styles.error}>{errors.confirmPassword}</p>
        </FormGroup>
        <PasswordConstraints constraints={constraints} />
        <ActionGroup>
          <Button isBlock onClick={() => sendTempPasword(token)} isDisabled={!enableSubmitBtn}>
            <Title
              headingLevel="h4"
              size="xl"
              style={!enableSubmitBtn ? { color: 'black' } : { color: 'white' }}
            >
              Change Password
            </Title>
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
  return <AuthLayout toPreview={form} heading="Enter New Password" backOpt="true" />;
};

export default connect(mapStateToProps)(PasswordRecovery);
