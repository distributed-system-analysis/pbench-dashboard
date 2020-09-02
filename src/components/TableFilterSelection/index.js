import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Flex, FlexItem } from '@patternfly/react-core';

import Select from '@/components/Select';

import Button from '../Button';

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
    };
  }

  onFilterTable = () => {
    const { selectedFilters } = this.state;
    const { onFilterTable } = this.props;

    onFilterTable(selectedFilters);
    this.setState({ updateFiltersDisabled: true });
  };

  onFilterChange = (event, value, category) => {
    const { selectedFilters } = this.state;

    if (value) {
      selectedFilters[category] = value;
    } else {
      delete selectedFilters[category];
    }

    this.setState({ selectedFilters });
    this.setState({ updateFiltersDisabled: false });
  };

  onClearFilters = () => {
    this.setState({
      selectedFilters: [],
    });
    this.setState({ updateFiltersDisabled: false });
  };

  render() {
    const { filters } = this.props;
    const { selectedFilters, updateFiltersDisabled } = this.state;

    return (
      <div>
        <Form
          style={{
            padding: '24px',
            backgroundColor: '#FAFAFA',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
          }}
        >
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
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              name="Filter"
              disabled={updateFiltersDisabled}
              onClick={this.onFilterTable}
            />
            <Button
              type="secondary"
              style={{ marginLeft: 8 }}
              onClick={this.onClearFilters}
              name="Clear"
            />
          </div>
        </Form>
      </div>
    );
  }
}
