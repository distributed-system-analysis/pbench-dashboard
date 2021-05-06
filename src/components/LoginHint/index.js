import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Title, Button, Banner, Flex, FlexItem } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import styles from './index.less';

@connect(({ store, auth }) => ({
  store,
  auth: auth.auth,
}))
class Overview extends Component {
  navigateToAuth = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/auth`));
  };

  render() {
    const { closeLoginHint } = this.props;
    return (
      <Banner variant="info">
        <Flex>
          <FlexItem>
            <Title headingLevel="h4">Want to see only metrics relevant to you? </Title>
          </FlexItem>
          <FlexItem>
            <Button
              className={styles.btnHint}
              variant="link"
              onClick={() => this.navigateToAuth()}
              isInline
            >
              Login or Create an account
            </Button>
          </FlexItem>
          <FlexItem align={{ sm: 'alignRight' }}>
            <Button
              className={styles.btnClose}
              variant="link"
              onClick={() => closeLoginHint()}
              isInline
            >
              <CloseIcon />
            </Button>
          </FlexItem>
        </Flex>
      </Banner>
    );
  }
}

export default Overview;
