import React from 'react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownToggle } from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';
import Button from '../Button';

export default class RowSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isManageRunDropdownOpen: false,
    };
  }

  onSelectManageRunDropdown = () => {
    const { isManageRunDropdownOpen } = this.state;
    this.setState({
      isManageRunDropdownOpen: !isManageRunDropdownOpen,
    });
  };

  onToggleManageRunDropdown = isManageRunDropdownOpen => {
    this.setState({
      isManageRunDropdownOpen,
    });
  };

  render() {
    const {
      selectedItems,
      compareActionName,
      onCompare,
      saveRuns,
      removeResultFromSeen,
      favoriteResult,
      deleteResult,
      style,
    } = this.props;
    const { isManageRunDropdownOpen } = this.state;

    const manageRunDropdown = [
      <DropdownItem key="save" onClick={saveRuns}>
        {' '}
        Save Runs
      </DropdownItem>,
      <DropdownItem key="unread" onClick={removeResultFromSeen}>
        {' '}
        Mark as unread
      </DropdownItem>,
      <DropdownItem key="favorite" onClick={favoriteResult}>
        Mark Favorited
      </DropdownItem>,
      <DropdownSeparator key="separator" />,
      <DropdownItem key="delete" onClick={deleteResult}>
        Delete runs
      </DropdownItem>,
    ];

    return (
      <div style={style}>
        <Button
          type="primary"
          onClick={onCompare}
          name={compareActionName}
          disabled={!(selectedItems > 0)}
          style={{ marginRight: 8 }}
        />
        <Dropdown
          onSelect={this.onSelectManageRunDropdown}
          toggle={
            <DropdownToggle
              onToggle={this.onToggleManageRunDropdown}
              toggleIndicator={CaretDownIcon}
              isPrimary
            >
              Manage runs
            </DropdownToggle>
          }
          isOpen={isManageRunDropdownOpen}
          dropdownItems={manageRunDropdown}
          style={{ display: selectedItems === 0 ? 'none' : 'inline-block', float: 'right' }}
        />
        <span style={{ marginLeft: 8 }}>
          {selectedItems > 0 ? `Selected ${selectedItems} items` : ''}
        </span>
      </div>
    );
  }
}
