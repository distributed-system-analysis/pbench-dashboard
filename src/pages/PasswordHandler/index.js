import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
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

@connect(user => ({
  user: user.user,
}))
class PasswordHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variantVal: 'tertiary',
      btnColor: 'black',
      alertVisible: false,
      btnDisabled: 'true',
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

  handleEmailInputChange = email => {
    if (email !== '') {
      this.enableSubmitBtn();
    } else {
      this.disableSubmitBtn();
    }
  };

  navigate = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  sendTempPasword = () => {
    const ele = document.getElementById('horizontal-form-email');
    ele.classList.add('pf-m-success');
    this.setState({ alertVisible: true });
  };

  hideAlertTwo = () => {
    this.setState({ alertVisible: false });
  };

  render() {
    const { variantVal, btnColor, alertVisible, btnDisabled } = this.state;
    const form = (
      <div className={styles.section}>
        {alertVisible && (
          <Alert
            className={styles.alert}
            variant="success"
            title="Success alert title 2"
            action={<AlertActionCloseButton onClose={this.hideAlertTwo} />}
          />
        )}
        <Title headingLevel="h4" size="xl">
          <b>Retrieve password</b>
        </Title>
        <br />
        <Form>
          <FormGroup label="Email address" isRequired fieldId="horizontal-form-email">
            <TextInput
              isRequired
              type="text"
              id="horizontal-form-email"
              aria-describedby="horizontal-form-email-helper"
              name="horizontal-form-email"
              onChange={this.handleEmailInputChange}
            />
          </FormGroup>
          <p className={styles.pElement}>
            This will be single-use password. <br />
            You should reset your password in the User settings of <br />
            the dashboard
          </p>
          <ActionGroup>
            <Button
              isBlock
              variant={variantVal}
              className={styles.btn}
              id="submitBtn"
              onClick={() => this.sendTempPasword()}
              {...(btnDisabled === 'true' ? { isDisabled: 'true' } : {})}
            >
              <Title headingLevel="h4" size="xl" style={{ color: btnColor }}>
                Send temporary password
              </Title>
            </Button>
          </ActionGroup>
          <Button
            variant="link"
            isInline
            className={styles.inlineLink}
            onClick={() => this.navigate('login')}
          >
            Go to login
          </Button>
        </Form>
      </div>
    );
    return <AuthLayout toPreview={form} heading="Forgot your password" backOpt="true" />;
  }
}

export default PasswordHandler;
