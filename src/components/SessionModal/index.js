import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Alert,
  AlertGroup,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextArea,
  TextInput,
  ToolbarItem,
  Button,
} from '@patternfly/react-core';
import { ShareAltIcon } from '@patternfly/react-icons';

class SessionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      shareModalVisible: false,
      successModalVisible: false,
      copyLinkAlertVisible: false,
      sessionUrl: '',
    };
  }

  toggleShareModal = () => {
    const { shareModalVisible } = this.state;

    this.setState({
      shareModalVisible: !shareModalVisible,
    });
  };

  toggleSuccessModal = () => {
    const { successModalVisible } = this.state;

    this.setState({
      successModalVisible: !successModalVisible,
    });
  };

  onGenerateUrl = () => {
    const { dispatch } = this.props;
    const { description } = this.state;

    // eslint-disable-next-line no-underscore-dangle
    const { routing, global, dashboard, search } = window.g_app._store.getState();
    const sessionConfig = JSON.stringify({ routing, global, dashboard, search });

    dispatch({
      type: 'sessions/saveSession',
      payload: {
        sessionConfig,
        description,
      },
    }).then(result => {
      this.setState({
        shareModalVisible: false,
        sessionUrl: `${window.location.origin}/dashboard/share/${result.data.createSession.id}`,
      });
      this.toggleSuccessModal();
    });
  };

  copyLink = () => {
    this.setState({ copyLinkAlertVisible: true });
  };

  updateDescription = value => {
    this.setState({
      description: value,
    });
  };

  render() {
    const {
      shareModalVisible,
      successModalVisible,
      copyLinkAlertVisible,
      description,
      sessionUrl,
    } = this.state;
    const { savingSession } = this.props;

    return (
      <span>
        <ToolbarItem>
          <Button onClick={this.toggleShareModal} variant="plain">
            <ShareAltIcon />
          </Button>
        </ToolbarItem>
        <Modal
          variant={ModalVariant.small}
          title="Share Session Link"
          isOpen={shareModalVisible}
          onClose={this.toggleShareModal}
          actions={[
            <Button
              key="submit"
              type="primary"
              onClick={this.onGenerateUrl}
              loading={savingSession}
            >
              Save
            </Button>,
            <Button key="back" variant="link" onClick={this.toggleShareModal}>
              Cancel
            </Button>,
          ]}
        >
          <Form>
            <FormGroup label="Description">
              <TextArea
                id="description"
                name="description"
                value={description}
                onChange={this.updateDescription}
              />
            </FormGroup>
          </Form>
        </Modal>
        <Modal
          variant={ModalVariant.small}
          title="Generated session link"
          isOpen={successModalVisible}
          onClose={this.toggleSuccessModal}
        >
          {copyLinkAlertVisible && (
            <AlertGroup isToast>
              <Alert title={`Copied the link: ${sessionUrl}`} />
            </AlertGroup>
          )}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput value={sessionUrl} />
            <CopyToClipboard text={sessionUrl}>
              <Button style={{ marginLeft: 8 }} onClick={this.copyLink}>
                Copy Link
              </Button>
            </CopyToClipboard>
          </div>
        </Modal>
      </span>
    );
  }
}

export default SessionModal;
