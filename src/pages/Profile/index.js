import React from 'react';
import {
  Button,
  Grid,
  GridItem,
  Text,
  TextVariants,
  Card,
  CardBody,
  CardFooter,
  Switch,
} from '@patternfly/react-core';
import { connect } from 'dva';
import { SignOutAltIcon, PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import styles from './index.less';
import avatar from '../../assets/avatar.svg';

@connect(({ datastore, global, user }) => ({
  user: user.user,
  indices: datastore.indices,
  selectedIndices: global.selectedIndices,
}))
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: true,
    };
  }

  componentDidMount = () => {};

  handleChange = isChecked => {
    this.setState({ isChecked });
  };

  render() {
    const { isChecked } = this.state;
    // const { selectedIndices, indices } = this.props;
    return (
      <div>
        <Grid>
          <GridItem span={4}>
            <Card className={styles.profileCard}>
              <CardBody>
                <div className={styles.avatarDiv}>
                  <img src={avatar} alt="avatar" className={styles.avatar} />
                </div>
                <div className={styles.userNameDiv}>
                  <Text component={TextVariants.h1}>Admin</Text>
                  <Text component={TextVariants.h1}>Email : admin@redhat.com</Text>
                </div>
                <div className={styles.detailsDiv} />
              </CardBody>
              <CardFooter style={{ marginBottom: '10px' }}>
                <Grid>
                  <GridItem span={7} offset={1}>
                    <Button variant="link">Change Password</Button>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="link" icon={<SignOutAltIcon />}>
                      Logout
                    </Button>{' '}
                  </GridItem>
                </Grid>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem span={8} offset={4} style={{ marginLeft: '24px' }}>
            <Card className={styles.profileCard}>
              <CardBody>
                <Grid>
                  <GridItem span={3} offset={1}>
                    <p>Default Indices: </p>
                  </GridItem>
                </Grid>
                <Grid>
                  <GridItem span={3} offset={1}>
                    <p>Data Preference: </p>
                  </GridItem>
                  <GridItem span={5}>
                    <Switch
                      id="simple-switch"
                      label="Private"
                      labelOff="Public"
                      isChecked={isChecked}
                      onChange={this.handleChange}
                    />
                  </GridItem>
                </Grid>
                <div />
              </CardBody>
              <CardFooter style={{ marginBottom: '10px' }}>
                <Grid>
                  <GridItem span={7} offset={1}>
                    <Button variant="link" icon={<PencilAltIcon />}>
                      Edit Details
                    </Button>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="link" icon={<UndoIcon />}>
                      Reset Data
                    </Button>
                  </GridItem>
                </Grid>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </div>
    );
  }
}

export default Profile;
