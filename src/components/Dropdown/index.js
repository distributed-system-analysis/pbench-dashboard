import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle } from '@patternfly/react-core';

export default class PFDropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.onToggle = isOpen => {
      this.setState({
        isOpen,
      });
    };
    this.onSelect = () => {
      const { isOpen } = this.state;
      this.setState({
        isOpen: !isOpen,
      });
      this.onFocus();
    };
    this.onFocus = () => {
      const element = document.getElementById('toggle-id');
      element.focus();
    };
  }

  render() {
    const { isOpen } = this.state;
    const { dropDownElement } = this.props;
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle id="toggle-id" onToggle={this.onToggle}>
            {dropDownElement}
          </DropdownToggle>
        }
        isOpen={isOpen}
        {...this.props}
      />
    );
  }
}
