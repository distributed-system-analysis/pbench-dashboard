import React, { Component, Fragment } from 'react';
import {
  Grid,
  GridItem,
  Title,
  Flex,
  FlexItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Button,
} from '@patternfly/react-core';
import { connect } from 'dva';
import { CaretDownIcon } from '@patternfly/react-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import logo from '../../assets/white.svg';

@connect(user => ({
  user: user.user,
}))
class AuthLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  onSelect = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  navigateToHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/`));
  };

  render() {
    const { toPreview, heading, backOpt } = this.props;
    const { isOpen } = this.state;

    const dropdownItems = [
      <DropdownItem key="german" className={styles.form}>
        German
      </DropdownItem>,
      <DropdownItem key="hindi" className={styles.form}>
        Hindi
      </DropdownItem>,
      <DropdownItem key="french" className={styles.form}>
        French
      </DropdownItem>,
    ];

    const back = (
      <Button
        id="backBtn"
        variant="link"
        icon={<FontAwesomeIcon icon={faAngleLeft} />}
        className={styles.inlineLink}
        style={{ padding: '0 0 20px 5px' }}
        onClick={() => this.navigateToHome()}
      >
        Back
      </Button>
    );
    const Heading = (
      <div>
        <Title headingLevel="h2" size="3xl" className={styles.section}>
          {backOpt === 'true' ? back : <Fragment />}
          <br />
          {heading}
          <Dropdown
            style={{ float: 'right' }}
            id="toggle"
            onSelect={this.onSelect}
            toggle={
              <DropdownToggle
                id="toggle-id"
                onToggle={this.onToggle}
                iconComponent={CaretDownIcon}
                style={{ padding: '5px' }}
              >
                English
              </DropdownToggle>
            }
            isOpen={isOpen}
            dropdownItems={dropdownItems}
          />
        </Title>
      </div>
    );
    return (
      <div className={styles.mainDiv}>
        <div className="pf-c-background-image">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pf-c-background-image__filter"
            width="0"
            height="0"
          >
            <filter id="image_overlay">
              <feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0" />
              <feComponentTransfer colorInterpolationFilters="sRGB" result="duotone">
                <feFuncR type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncG type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncB type="table" tableValues="0.086274509803922 0.43921568627451" />
                <feFuncA type="table" tableValues="0 1" />
              </feComponentTransfer>
            </filter>
          </svg>
        </div>
        <Grid style={{ marginTop: '75px' }}>
          <GridItem
            sm={8}
            md={4}
            lg={4}
            smOffset={1}
            mdOffset={1}
            lgOffset={1}
            className={styles.form}
          >
            {Heading}
            {toPreview}
          </GridItem>
          <GridItem
            sm={11}
            md={5}
            lg={5}
            smOffset={9}
            mdOffset={6}
            lgOffset={6}
            className={styles.sideGrid}
          >
            <div>
              <img src={logo} alt="pbench_logo" className={styles.logo} />
            </div>
            <div className={styles.sideGridItem}>
              <Title headingLevel="h4" size="xl">
                Pbench is a harness that allows data collection from a variety of tools while
                running a benchmark. Pbench has some built-in script that run some common
                benchmarks.
              </Title>
            </div>
            <div className={styles.sideGridItem}>
              <Flex>
                <FlexItem>
                  <h4>Terms of Use</h4>
                </FlexItem>
                <FlexItem>
                  <h4>Help</h4>
                </FlexItem>
                <FlexItem>
                  <h4>Privancy Policy</h4>
                </FlexItem>
              </Flex>
            </div>
          </GridItem>
        </Grid>
      </div>
    );
  }
}

export default AuthLayout;
