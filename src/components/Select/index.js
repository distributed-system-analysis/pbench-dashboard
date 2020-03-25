import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Select as PFSelect,
  SelectOption,
  SelectVariant,
  SelectDirection,
} from '@patternfly/react-core';

export default class Select extends PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isToggleIcon: false,
      isExpanded: false,
      isDisabled: false,
      direction: SelectDirection.down,
    };
  }

  onToggle = isExpanded => {
    this.setState({
      isExpanded,
    });
  };

  clearSelection = () => {
    this.setState({
      isExpanded: false,
    });
  };

  toggleDisabled = checked => {
    this.setState({
      isDisabled: checked,
    });
  };

  setIcon = checked => {
    this.setState({
      isToggleIcon: checked,
    });
  };

  toggleDirection = () => {
    const { direction } = this.state;

    if (direction === SelectDirection.up) {
      this.setState({
        direction: SelectDirection.down,
      });
    } else {
      this.setState({
        direction: SelectDirection.up,
      });
    }
  };

  render() {
    const { options, onSelect, selected } = this.props;
    const { isExpanded, isDisabled, direction, isToggleIcon } = this.state;

    return (
      <PFSelect
        toggleIcon={isToggleIcon}
        variant={SelectVariant.single}
        onToggle={this.onToggle}
        onSelect={onSelect}
        selections={selected}
        isExpanded={isExpanded}
        isDisabled={isDisabled}
        direction={direction}
      >
        {options.map(option => (
          <SelectOption key={option} value={parseInt(option, 10) + 1} />
        ))}
      </PFSelect>
    );
  }
}
