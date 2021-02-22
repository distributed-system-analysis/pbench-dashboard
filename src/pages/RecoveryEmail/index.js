import AuthLayout from '@/components/AuthLayout';
import React, { useEffect, useState } from 'react';
import {
  Title,
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  Card,
  CardTitle,
  CardBody,
} from '@patternfly/react-core';
import styles from './index.less';
import { validateEmail } from '../../utils/validator';

export default props => {
  const [enableSubmitBtn, setEnableSubmitButton] = useState(false);
  const [waitOnEmail, setWaitOnEmail] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
  });
  const [email, setEmail] = useState('');

  /* eslint-disable no-restricted-syntax */
  const validateForm = () => {
    if (email.trim() === '') {
      return false;
    }
    // check if no errors.
    for (const dep of Object.entries(errors)) {
      if (dep[1].length > 0) {
        return false;
      }
    }
    return true;
  };

  useEffect(
    () => {
      if (validateForm()) {
        setEnableSubmitButton(true);
      }
    },
    [email]
  );

  const handleEmailInputChange = val => {
    setEmail(val);
    // validate email.
    const validEmail = validateEmail(val);
    setErrors({
      ...errors,
      ...validEmail,
    });
  };

  const handleFormSubmit = () => {
    setWaitOnEmail(true);
    const { dispatch } = props;
    dispatch({
      type: 'auth/sendRecoveryEmail',
      payload: {
        email,
      },
    });
  };

  const form = (
    <div className={styles.section}>
      <br />
      {waitOnEmail ? (
        <Card>
          <CardTitle>An email has been sent to the account associated with</CardTitle>
          <CardBody>{email}</CardBody>
        </Card>
      ) : (
        <Form>
          <Title headingLevel="h4" size="xl">
            Enter Recovery Email
          </Title>
          <FormGroup label="Email" isRequired fieldId="horizontal-form-password">
            <TextInput id="email" isRequired type="email" onChange={handleEmailInputChange} />
            <p className={styles.error}>{errors.email}</p>
          </FormGroup>
          <ActionGroup>
            <Button
              isBlock
              onClick={handleFormSubmit}
              {...(enableSubmitBtn === false ? { isDisabled: true } : {})}
            >
              Submit
            </Button>
          </ActionGroup>
        </Form>
      )}
    </div>
  );
  return <AuthLayout toPreview={form} heading="" backOpt="true" />;
};
