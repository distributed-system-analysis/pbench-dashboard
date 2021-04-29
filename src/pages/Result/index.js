import React, { Component } from 'react';
import { connect } from 'dva';
import {
  TextContent,
  Text,
  TextVariants,
  Hint,
  HintBody,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import styles from './index.less';
import Summary from '../Summary';

@connect(({ global, loading }) => ({
  selectedResults: global.selectedResults,
  loading: loading.effects['dashboard/fetchResults'],
}))
class Result extends Component {
  render() {
    const { selectedResults } = this.props;
    const acceptanceStatus = selectedResults[0].saved;
    const unAcceptedHint = (
      <Hint className={styles.customUnAccepteddHint}>
        <HintBody>
          <Flex>
            <FlexItem>
              <ExclamationTriangleIcon className={styles.warning} />
            </FlexItem>
            <FlexItem>
              <TextContent>
                <Text component={TextVariants.h6}> You haven&apos;t managed the run yet </Text>
              </TextContent>
              <span>
                <a style={{ color: '#2c9af3' }} className={styles.actionBtn}>
                  Accept this run
                </a>
                <a style={{ color: 'red' }} className={styles.actionBtn}>
                  Delete run
                </a>
              </span>
            </FlexItem>
          </Flex>
        </HintBody>
      </Hint>
    );

    return (
      <React.Fragment>
        <div className={styles.paddingBig}>
          <TextContent className={styles.paddingSmall}>
            <Text component={TextVariants.h1}> {selectedResults[0].result}</Text>
            <span className={styles.label}>{selectedResults[0].controller}</span>
          </TextContent>
          {acceptanceStatus === true ? '' : unAcceptedHint}
        </div>
        <div>
          <Summary />
        </div>
      </React.Fragment>
    );
  }
}

export default Result;
