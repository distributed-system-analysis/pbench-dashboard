import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SearchIcon } from '@patternfly/react-icons';
import { InputGroup, Button, TextInput } from '@patternfly/react-core';

export default class SearchBar extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    style: PropTypes.object,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    placeholder: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
    };
  }

  onChange = value => {
    this.setState({ searchValue: value });
  };

  onEnter = event => {
    const { onSearch } = this.props;
    const { searchValue } = this.state;

    if (event.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  render() {
    const { onSearch, style, placeholder } = this.props;
    const { searchValue } = this.state;

    return (
      <InputGroup style={{ maxWidth: 300, ...style }}>
        <TextInput
          aria-label="search"
          value={searchValue}
          type="search"
          placeholder={placeholder}
          onChange={this.onChange}
          onKeyDown={this.onEnter}
        />
        <Button onClick={() => onSearch(searchValue)} variant="control">
          <SearchIcon />
        </Button>
      </InputGroup>
    );
  }
}
