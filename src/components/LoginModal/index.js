import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import LoginForm from '@/components/LoginForm';

@connect(auth => ({
  auth: auth.auth,
}))
class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalView: false,
    };
  }

  componentDidMount() {
    this.handleModalToggle();
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  handleModalCancel = () => {
    const { dispatch } = this.props;
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
    dispatch(routerRedux.push(`/`));
  };

  handleLoginModal = () => {
    this.setState({
      modalView: true,
    });
  };

  handleSignupModal = () => {
    const { dispatch } = this.props;
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
    dispatch(routerRedux.push(`/signup`));
  };

  render() {
    const { isModalOpen, modalView } = this.state;
    const loginAction = (
      <div>
        <TextContent>
          <Text component={TextVariants.h4}>
            This action requires login. Please login to Pbench Dashboard to continue.
          </Text>
        </TextContent>
        <Button key="confirm" variant="primary" onClick={this.handleLoginModal}>
          Login
        </Button>
        <Button key="confirm" variant="link" onClick={this.handleSignupModal}>
          Signup
        </Button>
        <Button key="cancel" variant="link" onClick={this.handleModalCancel}>
          Cancel
        </Button>
      </div>
    );
    const modalContent = !modalView ? loginAction : <LoginForm />;
    return (
      <React.Fragment>
        <Modal
          variant={ModalVariant.small}
          isOpen={isModalOpen}
          onClose={this.handleModalCancel}
          showClose="false"
        >
          {modalContent}
        </Modal>
      </React.Fragment>
    );
  }
}

export default LoginModal;
