import React, { Component, Fragment } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

@connect(auth => ({
  auth: auth.auth,
}))
class PrivateRoute extends Component {
  render() {
    const { children, auth, dispatch } = this.props;

    if (auth.auth.username === 'admin') {
      return <Fragment>{children}</Fragment>;
    }

    dispatch(routerRedux.push(`/auth`));
    return <AuthLayout />;
  }
}
export default PrivateRoute;
