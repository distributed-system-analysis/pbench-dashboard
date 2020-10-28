import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { Modal, ModalVariant } from '@patternfly/react-core';

export default props => {
  const [isModalOpen, setOpenModal] = useState(false);
  useEffect(() => {
    const { showLoginModal } = props;
    setOpenModal(showLoginModal);
  });
  const { redirect, content, onConfirm, modalTitle } = props;
  const handleModalToggle = () => {
    setOpenModal(false);
    onConfirm();
  };
  return (
    <React.Fragment>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        title={modalTitle || ' '}
        actions={[<Button key="confirm" variant="primary" onClick={redirect} name="confirm" />]}
      >
        {content}
      </Modal>
    </React.Fragment>
  );
};
