import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import { CheckIcon, CloseIcon } from '@patternfly/react-icons';

export default props => {
  const { constraints } = props;
  // We have certain constraints on the password.
  // Depending upon if these are met, we either display
  // or hide them.
  const getSplitDisplayProperty = (name, type) => {
    if (constraints[name] === 'met' && type === 'check') {
      return 'block';
    }
    if (constraints[name] === 'unmet' && type === 'close') {
      return 'block';
    }
    return 'none';
  };
  return (
    <>
      <h4>Password must contain at least</h4>
      <Split>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordLength', 'close'),
          }}
        >
          <CloseIcon style={{ color: 'red' }} />
        </SplitItem>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordLength', 'check'),
          }}
        >
          <CheckIcon style={{ color: 'green' }} />
        </SplitItem>
        <SplitItem isFilled style={{ marginLeft: '15px' }}>
          8 characters
        </SplitItem>
      </Split>
      <Split>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordSpecialChars', 'close'),
          }}
        >
          <CloseIcon style={{ color: 'red' }} />
        </SplitItem>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordSpecialChars', 'check'),
          }}
        >
          <CheckIcon style={{ color: 'green' }} />
        </SplitItem>
        <SplitItem isFilled style={{ marginLeft: '15px' }}>
          1 special character
        </SplitItem>
      </Split>
      <Split>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordContainsNumber', 'close'),
          }}
        >
          <CloseIcon style={{ color: 'red' }} />
        </SplitItem>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordContainsNumber', 'check'),
          }}
        >
          <CheckIcon style={{ color: 'green' }} />
        </SplitItem>
        <SplitItem isFilled style={{ marginLeft: '15px' }}>
          1 number
        </SplitItem>
      </Split>
      <Split>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordBlockLetter', 'close'),
          }}
        >
          <CloseIcon style={{ color: 'red' }} />
        </SplitItem>
        <SplitItem
          style={{
            display: getSplitDisplayProperty('passwordBlockLetter', 'check'),
          }}
        >
          <CheckIcon style={{ color: 'green' }} />
        </SplitItem>
        <SplitItem isFilled style={{ marginLeft: '15px' }}>
          1 uppercase letter
        </SplitItem>
      </Split>
    </>
  );
};
