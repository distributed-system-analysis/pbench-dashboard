import React, { Component, Fragment } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(({ auth }) => ({
  username: auth.username,
}))
class PrivateRoute extends Component {
  render() {
    const { children, username, dispatch } = this.props;

    if (username) {
      return <Fragment>{children}</Fragment>;
    }

    dispatch(routerRedux.push(`/auth`));
    return <AuthLayout />;
  }
}
export default PrivateRoute;
