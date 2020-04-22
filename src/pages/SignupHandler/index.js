import React from 'react';
import { Form, FormGroup, TextInput, Checkbox, ActionGroup, Button } from '@patternfly/react-core';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(user => ({
  user: user.user,
}))
class SignupHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleUserNameInputChange = username => {
    this.setState({
      username,
    });
  };

  handlePassWordInputChange = password => {
    this.setState({
      password,
    });
  };

  handleSignupSubmit = () => {
    const { dispatch } = this.props;
    const { username, password } = this.state;
    console.log(username, password);
    dispatch(routerRedux.push(`/login`));
  };

  render() {
    const form = (
      <Form style={{ padding: '10px' }}>
        <FormGroup
          label="Name"
          isRequired
          fieldId="horizontal-form-name"
          helperText="Please provide your username"
        >
          <TextInput
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={this.handleUserNameInputChange}
          />
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
        <FormGroup fieldId="remember-me">
          <Checkbox label="Remeber me" id="alt-form-checkbox-1" name="alt-form-checkbox-1" />
        </FormGroup>
        <ActionGroup>
          <Button isBlock variant="primary" onClick={() => this.handleSignupSubmit()}>
            Submit
          </Button>
        </ActionGroup>
      </Form>
    );
    return <AuthLayout toPreview={form} action="Signup" signOptHidden="true" />;
  }
}

export default SignupHandler;
