import React, { Component } from 'react';
import { Link } from 'dva/router';
import PageHeader from '@/components/PageHeader';
import { Title, Button } from '@patternfly/react-core';
import { connect } from 'dva';
import styles from './PageHeaderLayout.less';

@connect(auth => ({
  auth: auth.auth,
}))
class PageHeaderLayout extends Component {
  render() {
    const { auth, children, wrapperClassName, top, hint, handleLogin, ...restProps } = this.props;
    return (
      <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
        {auth.auth.username === 'admin' ? (
          ''
        ) : (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#e7f1fa',
              border: '1px solid #bee1f4',
              boxShadow: 'rgba(3, 3, 3, 0.12) 0px 1px 2px 0px, rgba(3, 3, 3, 0.06) 0px 0px 2px 0px',
              display: 'flex',
            }}
          >
            <Title headingLevel="h2">
              {' '}
              Want to see only metrics relevant to you? &nbsp; &nbsp;
            </Title>
            <Button variant="link" onClick={() => handleLogin()} isInline>
              Login or Create an account?
            </Button>
          </div>
        )}
        {top}
        <PageHeader key="pageheader" {...restProps} linkElement={Link} />
        {children ? <div className={styles.content}>{children}</div> : null}
      </div>
    );
  }
}

export default PageHeaderLayout;
