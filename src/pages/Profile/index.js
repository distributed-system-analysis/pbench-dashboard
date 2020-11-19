import React from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  Grid,
  GridItem,
  Card,
  Level,
  LevelItem,
  Button,
  TextInput,
  Form,
  FormSelect,
  FormGroup,
  FormSelectOption,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { connect } from 'dva';
import {
  CheckCircleIcon,
  UserAltIcon,
  PencilAltIcon,
  KeyIcon,
  RedoIcon,
} from '@patternfly/react-icons';
import styles from './index.less';
import avatar from '../../assets/avatar.jpg';
import { profileData } from '../../../mock/user';

@connect(({ datastore, global, user }) => ({
  user: user.user,
  indices: datastore.indices,
  selectedIndices: global.selectedIndices,
}))
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.ref = {
      name: React.createRef(),
      email: React.createRef(),
      position: React.createRef(),
    };

    this.state = {
      editView: profileData.editView,
      displayName: profileData.displayName,
      emailVal: profileData.emailVal,
      positionVal: profileData.positionVal,
      accountStatus: profileData.accountStatus,
      companyID: profileData.companyID,
      color: '#0080005e',
      isModalOpen: false,
    };

    this.accountStatus = [
      { value: 'Active', label: 'Active', disabled: false },
      { value: 'Inactive', label: 'Inactive', disabled: false },
    ];
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  onaccountStatusChange = accountStatus => {
    this.setState({
      accountStatus,
      color: accountStatus === 'Active' ? '#0080005e' : '#ff000052',
    });
  };

  edit = () => {
    const { editView } = this.state;
    this.setState({
      editView: !editView,
    });
  };

  saveEdit = () => {
    const { editView, displayName, emailVal, positionVal } = this.state;
    const { name, email, position } = this.ref;
    const editedName = name.current.value ? name.current.value : displayName;
    const editedEmail = email.current.value ? email.current.value : emailVal;
    const editedPosition = position.current.value ? position.current.value : positionVal;

    this.setState({
      editView: !editView,
      displayName: editedName,
      emailVal: editedEmail,
      positionVal: editedPosition,
    });
  };

  cancelEdit = () => {
    const { editView } = this.state;
    this.setState({
      editView: !editView,
    });
  };

  render() {
    const {
      editView,
      displayName,
      emailVal,
      positionVal,
      accountStatus,
      companyID,
      color,
      isModalOpen,
    } = this.state;
    const { name, email, position } = this.ref;
    return (
      <div className={styles.profileDiv}>
        <TextContent>
          <Text component={TextVariants.h1}>User Profile</Text>
        </TextContent>
        <div className="headerDiv">
          <Grid hasGutter>
            <GridItem span={12} style={{ paddingRight: '32px' }}>
              <Grid>
                <GridItem span={9}>
                  <Card className={styles.card}>
                    <Level className={styles.levelCard}>
                      <LevelItem>
                        <UserAltIcon />
                        <span className={styles.subHeader}>Account Details</span>
                      </LevelItem>
                    </Level>
                    <div className={styles.detailsDiv}>
                      {editView === false ? (
                        <Button variant="link" icon={<PencilAltIcon />} onClick={this.edit}>
                          Edit
                        </Button>
                      ) : (
                        <Button variant="link" icon={<PencilAltIcon />} isDisabled>
                          Edit
                        </Button>
                      )}
                      <Grid style={{ marginTop: '16px' }} span={12}>
                        <Grid span={12} className={styles.grid}>
                          <GridItem span={4}>
                            <h1>
                              <b>Profile Picture</b>
                            </h1>
                            <div className={styles.avatarDiv}>
                              <img src={avatar} alt="avatar" className={styles.avatar} />
                            </div>
                          </GridItem>
                          <GridItem span={4}>
                            <h1>
                              <b>Display Name</b>
                            </h1>
                            {editView === false ? (
                              <TextContent>
                                <Text component={TextVariants.h5}>{displayName}</Text>
                              </TextContent>
                            ) : (
                              <TextInput
                                ref={name}
                                placeholder={displayName}
                                type="text"
                                aria-label="text input example"
                                className={styles.editInput}
                              />
                            )}
                          </GridItem>
                          <GridItem span={4}>
                            <h1>
                              <b>Position / Role</b>
                            </h1>
                            {editView === false ? (
                              <TextContent>
                                <Text component={TextVariants.h5}>{positionVal}</Text>
                              </TextContent>
                            ) : (
                              <TextInput
                                ref={position}
                                placeholder={positionVal}
                                type="text"
                                aria-label="text input example"
                                className={styles.editInput}
                              />
                            )}
                          </GridItem>
                        </Grid>
                        <Grid span={12} className={styles.grid}>
                          <GridItem span={4}>
                            <h1>
                              <b>ID</b>
                            </h1>
                            {editView === false ? (
                              <TextContent>
                                <Text component={TextVariants.h5}>{companyID}</Text>
                              </TextContent>
                            ) : (
                              <TextInput
                                value={profileData.companyID}
                                type="text"
                                isReadOnly
                                aria-label={profileData.companyID}
                                className={styles.editInput}
                              />
                            )}
                          </GridItem>
                          <GridItem span={4}>
                            <h1>
                              <b>Email</b>
                            </h1>
                            {editView === false ? (
                              <TextContent>
                                <Text component={TextVariants.h5}>{emailVal}</Text>
                              </TextContent>
                            ) : (
                              <TextInput
                                ref={email}
                                placeholder={emailVal}
                                type="text"
                                aria-label="text input example"
                                className={styles.editInput}
                              />
                            )}
                          </GridItem>
                        </Grid>
                        <Grid span={12} className={styles.grid}>
                          <GridItem span={4}>
                            <h1>
                              <b>Account Status</b>
                            </h1>
                            {editView === false ? (
                              <span
                                className={styles.successlabel}
                                style={{ backgroundColor: color }}
                              >
                                <CheckCircleIcon
                                  color={accountStatus === 'Active' ? 'green' : 'red'}
                                />
                                <span>{accountStatus}</span>
                              </span>
                            ) : (
                              <FormSelect
                                value={accountStatus}
                                onChange={this.onaccountStatusChange}
                                aria-label="FormSelect Input"
                                className={styles.expireSelect}
                              >
                                {this.accountStatus.map(option => (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <FormSelectOption value={option.value} label={option.label} />
                                ))}
                              </FormSelect>
                            )}
                          </GridItem>
                        </Grid>
                        {editView === false ? (
                          <></>
                        ) : (
                          <Grid span={12} className={styles.grid}>
                            <GridItem className={styles.grid}>
                              <Button
                                variant="primary"
                                className={styles.profileBtn}
                                onClick={this.saveEdit}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                className={styles.profileBtn}
                                onClick={this.cancelEdit}
                              >
                                Cancel{' '}
                              </Button>
                            </GridItem>
                          </Grid>
                        )}
                      </Grid>
                    </div>
                  </Card>
                </GridItem>
                <GridItem span={3}>
                  <div>
                    <Card className={styles.card}>
                      <div className={styles.subHeader}>
                        <KeyIcon />
                        <span className={styles.subHeader}>Settings</span>
                        <Grid className={styles.topCard}>
                          <GridItem span={12} className={styles.subCardDiv}>
                            <TextContent>
                              <span>Account creation Date</span>
                              <Text component={TextVariants.h4} style={{ marginTop: '0px' }}>
                                (dd/mm/yyyy)
                              </Text>
                            </TextContent>
                          </GridItem>
                        </Grid>
                        <Grid>
                          <GridItem span={12} className={styles.subCardDiv}>
                            <Button variant="link" icon={<RedoIcon />}>
                              Reset All Data
                            </Button>{' '}
                            <Button variant="link" onClick={this.handleModalToggle}>
                              Reset Password
                            </Button>
                            <Modal
                              variant={ModalVariant.small}
                              title="Reset Password"
                              isOpen={isModalOpen}
                              onClose={this.handleModalToggle}
                              actions={[
                                <Button
                                  key="confirm"
                                  variant="primary"
                                  onClick={this.handleModalToggle}
                                >
                                  Confirm
                                </Button>,
                                <Button
                                  key="cancel"
                                  variant="link"
                                  onClick={this.handleModalToggle}
                                >
                                  Cancel
                                </Button>,
                              ]}
                            >
                              <Form>
                                <FormGroup label="Old Password" isRequired fieldId="old-password">
                                  <TextInput
                                    isRequired
                                    type="text"
                                    id="old-password"
                                    name="old-password"
                                    aria-describedby="old-password-helper"
                                  />
                                </FormGroup>
                                <FormGroup label="New Password" isRequired fieldId="new-password">
                                  <TextInput
                                    isRequired
                                    type="text"
                                    id="new-password"
                                    name="new-password"
                                    aria-describedby="new-password-helper"
                                  />
                                </FormGroup>
                              </Form>
                            </Modal>
                          </GridItem>
                        </Grid>
                      </div>
                    </Card>
                  </div>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Profile;
