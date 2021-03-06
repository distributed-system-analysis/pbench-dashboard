import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

export default class RowSelection extends PureComponent {
  static propTypes = {
    selectedItems: PropTypes.array.isRequired,
    compareActionName: PropTypes.string.isRequired,
    onCompare: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { selectedItems, compareActionName, onCompare, style } = this.props;

    return (
      <div style={style}>
        <Button
          type="primary"
          onClick={onCompare}
          name={compareActionName}
          disabled={!(selectedItems > 0)}
          style={{ marginRight: 8 }}
        />
        <span style={{ marginLeft: 8 }}>
          {selectedItems > 0 ? `Selected ${selectedItems} items` : ''}
        </span>
      </div>
    );
  }
}
