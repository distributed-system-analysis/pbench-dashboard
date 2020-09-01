import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Popconfirm, Icon, Form, Modal, Input } from 'antd';
import {
  PageSection,
  PageSectionVariants,
  Divider,
  Text,
  TextContent,
  Card,
  CardBody,
  Tooltip,
} from '@patternfly/react-core';

import { getDiffDate } from '@/utils/moment_constants';
import Table from '@/components/Table';

const { TextArea } = Input;

@connect(({ datastore, explore, loading }) => ({
  sharedSessions: explore.sharedSessions,
  datastoreConfig: datastore.datastoreConfig,
  loadingSharedSessions: loading.effects['explore/fetchSharedSessions'],
}))
class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharedSessions: props.sharedSessions,
      visible: false,
      selectedID: '',
      editedDesc: '',
    };
  }

  componentDidMount() {
    this.fetchDatastoreConfig();
  }

  componentWillReceiveProps(nextProps) {
    const { sharedSessions } = this.props;

    if (nextProps.sharedSessions !== sharedSessions) {
      this.setState({ sharedSessions: nextProps.sharedSessions });
    }
  }

  fetchDatastoreConfig = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'datastore/fetchDatastoreConfig',
    }).then(() => {
      this.fetchSharedSessions();
    });
  };

  fetchSharedSessions = () => {
    const { dispatch, datastoreConfig } = this.props;

    dispatch({
      type: 'explore/fetchSharedSessions',
      payload: { datastoreConfig },
    });
  };

  startSharedSession = record => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push(`/private/share/${record.id}`));
  };

  editDescription = (id, value) => {
    const { dispatch, datastoreConfig } = this.props;
    dispatch({
      type: 'explore/editDescription',
      payload: { datastoreConfig, id, value },
    }).then(() => {
      this.fetchSharedSessions();
    });
  };

  getEditedDesc = value => {
    this.setState({
      editedDesc: value,
    });
  };

  showModal = id => {
    this.setState({
      visible: true,
      selectedID: id,
    });
  };

  handleSave = () => {
    const { selectedID, editedDesc } = this.state;
    this.editDescription(selectedID, editedDesc);
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  deleteSharedSession = record => {
    const { dispatch, datastoreConfig } = this.props;
    const { id } = record;
    dispatch({
      type: 'explore/deleteSharedSessions',
      payload: { datastoreConfig, id },
    }).then(() => {
      this.fetchSharedSessions();
    });
  };

  render() {
    const { sharedSessions, visible } = this.state;
    const { loadingSharedSessions } = this.props;
    const sharedSessionColumns = [
      {
        title: 'Session ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Date Created',
        dataIndex: 'created',
        key: 'created',
        defaultSortOrder: 'descend',
        sorter: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
        render: val => (
          <Tooltip content={val}>
            <span>{getDiffDate(val)}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Description',
        colSpan: 2,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Edit',
        colSpan: 0,
        dataIndex: '',
        key: 'edit',
        class: 'editDescription',
        render: record => {
          const value = <Icon type="edit" onClick={() => this.showModal(record.id)} />;
          const obj = {
            children: value,
          };
          return obj;
        },
      },
      {
        title: 'Action',
        colSpan: 2,
        dataIndex: '',
        key: 'action',
        render: (text, record) => (
          <Popconfirm
            title="Start a new dashboard session?"
            cancelText="No"
            okText="Yes"
            onConfirm={() => this.startSharedSession(record)}
          >
            <Button type="link">Start Session</Button>
          </Popconfirm>
        ),
      },
      {
        title: 'Delete',
        colSpan: 0,
        dataIndex: '',
        key: 'delete',
        class: 'deleteSession',
        render: record => {
          const value = (
            <Popconfirm
              title="Delete the dashboard session?"
              cancelText="No"
              okText="Yes"
              onConfirm={() => this.deleteSharedSession(record)}
            >
              <Icon
                class="deleteIcon"
                type="delete"
                theme="twoTone"
                style={{ textAlign: 'right' }}
              />
            </Popconfirm>
          );
          const obj = {
            children: value,
          };
          return obj;
        },
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
              <Table
                columns={sharedSessionColumns}
                dataSource={sharedSessions}
                loading={loadingSharedSessions}
              />
            </CardBody>
          </Card>
        </PageSection>
        <Modal
          title="Edit the description"
          visible={visible}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.getEditedDesc(document.getElementById('editedInput'))}
            >
              Save
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Description">
              <TextArea id="editedInput" rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Explore;
