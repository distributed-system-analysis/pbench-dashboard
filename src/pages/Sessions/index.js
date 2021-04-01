import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  PageSection,
  PageSectionVariants,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
  Text,
  TextContent,
  Card,
  CardBody,
  Tooltip,
  Button,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextArea,
} from '@patternfly/react-core';

import { getDiffDate } from '@/utils/moment_constants';
import Table from '@/components/Table';

@connect(({ sessions, loading }) => ({
  sessions: sessions.sessions,
  loadingSessions: loading.effects['sessions/fetchAllSessions'],
}))
class Sessions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessions: props.sessions,
      sessionId: '',
      description: '',
      sessionDescriptionModalVisible: false,
      sessionStartModalVisible: false,
      sessionDeleteModalVisible: false,
    };
  }

  componentDidMount() {
    this.fetchSessions();
  }

  componentDidUpdate(prevProps) {
    const { sessions } = this.props;

    if (prevProps.sessions !== sessions) {
      this.setState({ sessions });
    }
  }

  fetchSessions = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sessions/fetchAllSessions',
    });
  };

  startSession = sessionId => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push(`/share/${sessionId}`));
  };

  updateSessionDescription = (sessionId, description) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sessions/updateSessionDescription',
      payload: { sessionId, description },
    }).then(() => {
      this.setState({
        sessionDescriptionModalVisible: false,
      });
      this.fetchSessions();
    });
  };

  deleteSession = sessionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sessions/deleteSession',
      payload: { sessionId },
    }).then(() => {
      this.setState({
        sessionDeleteModalVisible: false,
      });
      this.fetchSessions();
    });
  };

  handleSessionDescriptionChange = value => {
    this.setState({
      description: value,
    });
  };

  sessionDescriptionModalToggle = session => {
    const { sessionDescriptionModalVisible } = this.state;

    if (sessionDescriptionModalVisible) {
      this.setState({ sessionDescriptionModalVisible: false });
    } else {
      this.setState({
        sessionDescriptionModalVisible: true,
        sessionId: session.id,
        description: session.description,
      });
    }
  };

  sessionStartModalToggle = session => {
    const { sessionStartModalVisible } = this.state;

    if (sessionStartModalVisible) {
      this.setState({ sessionStartModalVisible: false });
    } else {
      this.setState({
        sessionStartModalVisible: true,
        sessionId: session.id,
        description: session.description,
      });
    }
  };

  sessionDeleteModalToggle = session => {
    const { sessionDeleteModalVisible } = this.state;

    if (sessionDeleteModalVisible) {
      this.setState({ sessionDeleteModalVisible: false });
    } else {
      this.setState({
        sessionDeleteModalVisible: true,
        sessionId: session.id,
        description: session.description,
      });
    }
  };

  render() {
    const {
      sessions,
      description,
      sessionId,
      sessionDescriptionModalVisible,
      sessionDeleteModalVisible,
      sessionStartModalVisible,
    } = this.state;
    const { loadingSessions } = this.props;
    const sessionColumns = [
      {
        Header: 'Session ID',
        accessor: 'id',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Last Updated',
        accessor: 'updatedAt',
        Cell: row => (
          <Tooltip content={row.value}>
            <span>{getDiffDate(row.value)}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: cell => (
          <>
            <Button variant="link" onClick={() => this.sessionStartModalToggle(cell.row.original)}>
              Start Session
            </Button>
            <Button
              variant="link"
              onClick={() => this.sessionDescriptionModalToggle(cell.row.original)}
            >
              Edit
            </Button>
            <Button variant="link" onClick={() => this.sessionDeleteModalToggle(cell.row.original)}>
              Delete
            </Button>
          </>
        ),
      },
    ];

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Explore</Text>
          </TextContent>
        </PageSection>
        <Divider component="div" />
        <PageSection>
          <Card>
            <CardBody>
              <Table columns={sessionColumns} data={sessions} loading={loadingSessions} />
            </CardBody>
          </Card>
        </PageSection>
        <Modal
          variant={ModalVariant.small}
          title="Edit the session description"
          isOpen={sessionDescriptionModalVisible}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => this.updateSessionDescription(sessionId, description)}
            >
              Save
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => this.sessionDescriptionModalToggle()}
            >
              Cancel
            </Button>,
          ]}
        >
          <Form>
            <FormGroup fieldId="session-description">
              <TextArea
                value={description}
                onChange={this.handleSessionDescriptionChange}
                name="session-description-text"
                id="session-description-text"
              />
            </FormGroup>
          </Form>
        </Modal>
        <Modal
          variant={ModalVariant.small}
          title="Start a new session?"
          isOpen={sessionStartModalVisible}
          actions={[
            <Button key="confirm" variant="primary" onClick={() => this.startSession(sessionId)}>
              Start
            </Button>,
            <Button key="cancel" variant="link" onClick={() => this.sessionStartModalToggle()}>
              Cancel
            </Button>,
          ]}
        >
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Session ID</DescriptionListTerm>
              <DescriptionListDescription>{sessionId}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{description}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </Modal>
        <Modal
          variant={ModalVariant.small}
          title="Delete the dashboard session?"
          isOpen={sessionDeleteModalVisible}
          actions={[
            <Button key="confirm" variant="primary" onClick={() => this.deleteSession(sessionId)}>
              Delete
            </Button>,
            <Button key="cancel" variant="link" onClick={() => this.sessionDeleteModalToggle()}>
              Cancel
            </Button>,
          ]}
        >
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>Session ID</DescriptionListTerm>
              <DescriptionListDescription>{sessionId}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{description}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Sessions;
