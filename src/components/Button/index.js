import React from 'react';
import { Button as PatternFlyButton } from '@patternfly/react-core';

const Button = props => {
  const { name, variant, disabled, onClick } = props;

  return (
    <PatternFlyButton variant={variant} isDisabled={disabled} onClick={onClick} {...props}>
      {name}
    </PatternFlyButton>
  );
};

export default Button;
