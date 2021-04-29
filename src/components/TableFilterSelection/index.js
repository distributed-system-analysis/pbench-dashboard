import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Flex,
  FlexItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from '@patternfly/react-core';
import Select from '@/components/Select';
import styles from './index.less';

export default class TableFilterSelection extends Component {
  static propTypes = {
    onFilterTable: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedFilters: {},
      updateFiltersDisabled: true,
      isOpen: false,
    };
  }

  onFilterTable = () => {
    const { selectedFilters } = this.state;
    const { onFilterTable } = this.props;
    onFilterTable(selectedFilters);
    this.setState({ updateFiltersDisabled: true, isOpen: false });
  };

  onFilterChange = (event, value, category) => {
    const { selectedFilters } = this.state;
    if (selectedFilters[category] === undefined) {
      selectedFilters[category] = [value];
      this.setState({ selectedFilters });
    } else if (!selectedFilters[category].includes(value)) {
      selectedFilters[category].push(value);
      this.setState({ selectedFilters });
    } else {
      selectedFilters[category] = selectedFilters[category].filter(item => item !== value);
      this.setState({ selectedFilters });
    }
    this.setState({ updateFiltersDisabled: false });
  };

  onClearFilters = () => {
    this.setState({
      selectedFilters: [],
    });
    this.setState({ updateFiltersDisabled: false });
  };

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  render() {
    const { filters } = this.props;
    const { selectedFilters, updateFiltersDisabled, isOpen } = this.state;

    const dropdownItems = [
      <DropdownItem style={{ width: '50vw' }}>
        <div>
          <Form className={styles.form}>
            <Flex>
              {Object.keys(filters).map(category => (
                <FlexItem key={category} style={{ marginRight: 16, marginBottom: 16, width: 160 }}>
                  <p style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>{category}</p>
                  <Select
                    key={category}
                    selected={selectedFilters[category]}
                    options={filters[category]}
                    onSelect={(event, value) => this.onFilterChange(event, value, category)}
                  />
                </FlexItem>
              ))}
            </Flex>
            <Button
              variant="primary"
              type="submit"
              isDisabled={updateFiltersDisabled}
              onClick={this.onFilterTable}
            >
              Save
            </Button>
          </Form>
        </div>
      </DropdownItem>,
    ];

    return (
      <div>
        <Dropdown
          toggle={
            <DropdownToggle onToggle={this.onToggle} className={styles.primaryBtn} id="button">
              Apply Filters
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={dropdownItems}
        />
        <Button
          variant="plain"
          aria-label="Action"
          className={styles.btn}
          onClick={this.onClearFilters}
        >
          Clear all Filters
        </Button>
      </div>
    );
  }
}
