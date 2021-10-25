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
import { connect } from 'dva';
import styles from './index.less';

const mapStateToProps = state => {
  const { auth } = state;
  return { auth };
};

const LoginForm = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
  });
  const [btnDisabled, setBtnDisabled] = useState(true);

  const handleUsernameChange = val => {
    setUsername(val);
    setErrors({
      ...errors,
    });
  };

  const handleLoginSubmit = () => {
    const { dispatch } = props;
    dispatch({
      type: 'auth/loginUser',
      payload: {
        username,
        password,
      },
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
    <div className={styles.section}>
      <Form className={styles.section}>
        <FormGroup label="Username" isRequired fieldId="horizontal-form-name">
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
    </div>
  );
  return <React.Fragment>{form}</React.Fragment>;
};

export default connect(mapStateToProps)(LoginForm);
