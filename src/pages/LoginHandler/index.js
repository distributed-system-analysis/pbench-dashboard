import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  ActionGroup,
  Button,
  Title,
} from '@patternfly/react-core';
import { notification } from 'antd';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';
import { validateEmail } from '@/utils/validator';

const mapStateToProps = state => {
  const { auth } = state;
  return auth;
};

const LoginHandler = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
  });
  const [btnDisabled, setBtnDisabled] = useState(true);

  const setLoggedIn = payload => {
    const { dispatch } = props;
    dispatch({
      type: 'auth/loadUser',
      payload,
    }).then(() => {
      dispatch(routerRedux.push(`/private`));
    });
  };

  const handleUsernameChange = val => {
    setUsername(val);
    const validEmail = validateEmail(val);
    setErrors({
      ...errors,
      ...validEmail,
    });
  };

  /* eslint-disable camelcase */
  const handleLoginSubmit = async () => {
    const { dispatch } = props;
    const response = await dispatch({
      type: 'auth/loginUser',
      payload: {
        username,
        password,
      },
    });
    const { status, message, auth_token } = response;
    if (status === 'success') {
      localStorage.setItem('token', auth_token);
      setLoggedIn(username);
    }
    // shows a alert on failed
    // login attempt only.
    // a success response populates data
    // on the global header and should be
    // enough of a visual cue.
    notification.error({
      message,
    });
  };

  /* eslint-disable no-restricted-syntax */
  const validateForm = () => {
    if (username.trim() === '' || password.trim() === '') {
      return false;
    }
    for (const dep of Object.entries(errors)) {
      if (dep[1].length > 0) {
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
        setBtnDisabled(false);
      } else setBtnDisabled(true);
    },
    [username, password]
  );

  const form = (
    <Form className={styles.section}>
      <FormGroup label="Email address" isRequired fieldId="horizontal-form-name">
        <TextInput
          isRequired
          type="text"
          id="horizontal-form-name"
          aria-describedby="horizontal-form-name-helper"
          name="horizontal-form-name"
          onChange={handleUsernameChange}
        />
        <p className={styles.error}>{errors.email}</p>
      </FormGroup>
      <FormGroup label="Password" isRequired fieldId="horizontal-form-password">
        <TextInput
          isRequired
          type="password"
          id="horizontal-form-password"
          name="horizontal-form-password"
          onChange={val => setPassword(val)}
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
          onClick={handleLoginSubmit}
          className={styles.btn}
          id="submitBtn"
          isDisabled={btnDisabled}
        >
          <Title
            headingLevel="h4"
            size="xl"
            style={btnDisabled ? { color: 'black' } : { color: 'white' }}
          >
            Submit
          </Title>
        </Button>
      </ActionGroup>
    </Form>
  );
  return <AuthLayout toPreview={form} heading="Log into your Pbench Acount" backOpt="true" />;
};

export default connect(mapStateToProps)(LoginHandler);
