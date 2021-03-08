import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  ActionGroup,
  Button,
  Title,
  Alert,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './index.less';

const mapStateToProps = state => {
  const { auth } = state;
  return auth;
};

const LoginHandler = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertComponent, setAlertComponent] = useState({
    message: '',
    variant: '',
  });

  const setLoggedIn = payload => {
    const { dispatch } = props;
    dispatch({
      type: 'auth/loadUser',
      payload,
    }).then(() => {
      dispatch(routerRedux.push(`/private`));
    });
  };

  const handleLoginSubmit = async () => {
    const { dispatch } = props;
    const response = await dispatch({
      type: 'auth/loginUser',
      payload: {
        username,
        password,
      },
    });
    const { status, message } = response;
    setAlertComponent({
      message,
      variant: status === 'failure' ? 'danger' : 'success',
    });
    setAlertOpen(true);
    if (status === 'success') {
      // wait for a couple
      // of seconds before taking the
      // user to the overview page.
      setTimeout(() => {
        setLoggedIn({ username });
      }, 2000);
    }
  };

  useEffect(
    () => {
      if (username.trim() !== '' && password.trim() !== '') {
        setBtnDisabled(false);
      }
    },
    [username, password]
  );

  const form = (
    <Form className={styles.section}>
      {alertOpen ? (
        <Alert
          title={alertComponent.message}
          variant={alertComponent.variant}
          action={<AlertActionCloseButton onClose={() => setAlertOpen(!alertOpen)} />}
        />
      ) : (
        <></>
      )}
      <FormGroup label="Email address" isRequired fieldId="horizontal-form-name">
        <TextInput
          isRequired
          type="text"
          id="horizontal-form-name"
          aria-describedby="horizontal-form-name-helper"
          name="horizontal-form-name"
          onChange={val => setUsername(val)}
        />
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
          // variant={variantVal}
          onClick={handleLoginSubmit}
          className={styles.btn}
          id="submitBtn"
          {...(btnDisabled ? { isDisabled: true } : { isDisabled: false })}
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
  return (
    <div>
      <AuthLayout toPreview={form} heading="Log into your Pbench Acount" backOpt="true" />
    </div>
  );
};

export default connect(mapStateToProps)(LoginHandler);
