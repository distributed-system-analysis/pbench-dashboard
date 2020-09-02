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
      isOpen: false,
      isDisabled: false,
      direction: SelectDirection.down,
    };
  }

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  onClear = () => {
    this.setState({
      isOpen: false,
    });
  };

  toggleDisabled = checked => {
    this.setState({
      isDisabled: checked,
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
    const { isOpen, isDisabled, direction } = this.state;

    return (
      <PFSelect
        variant={SelectVariant.typeaheadMulti}
        placeholderText="Select"
        onToggle={this.onToggle}
        onClear={this.onClear}
        onSelect={onSelect}
        selections={selected}
        isOpen={isOpen}
        isDisabled={isDisabled}
        direction={direction}
      >
        {options.map(option => (
          <SelectOption key={option} value={option} />
        ))}
      </PFSelect>
    );
  }
}
