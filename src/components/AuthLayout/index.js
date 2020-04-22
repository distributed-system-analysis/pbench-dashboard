import React, { Component, Fragment } from 'react';
import {
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants,
  Button,
  Dropdown,
  DropdownToggle,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(user => ({
  user: user.user,
}))
class AuthLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  navigateToSignup = page => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/${page}`));
  };

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  onSelect = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  render() {
    const { toPreview, action, signOptHidden } = this.props;
    const { isOpen } = this.state;
    // DropdownMenu items
    const dropdownItems = [];
    const signupOption = (
      <Text component={TextVariants.h2}>
        Need an account?
        <Button variant="link" onClick={() => this.navigateToSignup('signup')}>
          <u>Sign up.</u>
        </Button>
      </Text>
    );

    // Action handlers for register and forgot password
    const restLoginHandlers = (
      <Grid
        gutter="md"
        style={{ borderTop: '2px solid black', padding: '10px', textAlign: 'center' }}
      >
        <GridItem>
          <TextContent style={{ padding: '10px' }}>
            {signOptHidden === 'true' ? <Fragment /> : signupOption}
            <Text component={TextVariants.h2}>
              <Button variant="link">
                <u>Forgot username or password?</u>
              </Button>
            </Text>
          </TextContent>
        </GridItem>
      </Grid>
    );

    return (
      <Grid style={{ marginTop: '200px' }}>
        <GridItem
          sm={8}
          md={4}
          lg={4}
          smOffset={2}
          mdOffset={2}
          lgOffset={2}
          style={{ border: '2px solid black' }}
        >
          <TextContent style={{ padding: '10px' }}>
            <Text component={TextVariants.h2}>
              {action} with...
              <Dropdown
                style={{ float: 'right' }}
                onSelect={this.onSelect}
                toggle={
                  <DropdownToggle
                    id="toggle-id"
                    onToggle={this.onToggle}
                    iconComponent={CaretDownIcon}
                  >
                    English
                  </DropdownToggle>
                }
                isOpen={isOpen}
                dropdownItems={dropdownItems}
              />
            </Text>
          </TextContent>
          {toPreview}
          {restLoginHandlers}
        </GridItem>
      </Grid>
    );
  }
}

export default AuthLayout;
