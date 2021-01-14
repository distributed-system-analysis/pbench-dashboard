import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Spinner } from '@patternfly/react-core';

@connect(({ sessions }) => ({
  sessions,
}))
class SessionPlaceholder extends React.Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-underscore-dangle
    this.store = window.g_app._store;
  }

  componentDidMount = () => {
    this.persistCurrentSession();
  };

  persistCurrentSession = () => {
    const { routing, global, dashboard, search } = this.store.getState();
    const parsedSessionConfig = JSON.stringify({ routing, global, dashboard, search });

    Promise.resolve(window.localStorage.setItem('persist:session', parsedSessionConfig)).then(
      () => {
        this.fetchSession();
      }
    );
  };

  fetchSession = async () => {
    const { dispatch } = this.props;
    const path = window.location.href;
    const id = path.substring(path.lastIndexOf('/') + 1);

    dispatch({
      type: 'sessions/fetchSession',
      payload: {
        sessionId: id,
      },
    }).then(response => {
      this.rehydrateNamespaces(response.sessionConfig, response.sessionMetadata);
    });
  };

  rehydrateNamespaces = async (sessionConfig, sessionMetadata) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/rehydrateSession',
      payload: sessionConfig,
    }).then(() => {
      this.startSession(sessionConfig, sessionMetadata);
    });
  };

  startSession = (sessionConfig, sessionMetadata) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sessions/startSession',
      payload: sessionMetadata,
    }).then(() => {
      dispatch(routerRedux.push(sessionConfig.routing.location.pathname));
    });
  };

  render() {
    return <Spinner />;
  }
}

export default connect(() => ({}))(SessionPlaceholder);
