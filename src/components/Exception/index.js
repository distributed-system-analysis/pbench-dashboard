import React from 'react';
import { Title, TitleSizes } from '@patternfly/react-core';
import Button from '../Button';

const Exception = props => {
  const { type, description } = props;

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Title headingLevel="h1" size={TitleSizes['4xl']}>
        {type}
      </Title>
      <Title headingLevel="h3" size={TitleSizes.lg}>
        {description}
      </Title>
      <Button style={{ marginTop: 8 }} name="Go back" onClick={() => window.history.back()} />
    </div>
  );
};

export default Exception;
