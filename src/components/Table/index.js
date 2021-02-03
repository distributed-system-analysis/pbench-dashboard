import React, { PureComponent } from 'react';
import {
  Table as PatternFlyTable,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';
import { Checkbox } from '@patternfly/react-core';

export default class Table extends PureComponent {
  constructor(props) {
    super(props);

    const { dataSource, columns, actions } = props;

    this.state = {
      cells: this.parseColumns(columns),
      rows: this.parseRows(dataSource),
      actions,
      canSelectAll: true,
    };
  }

  parseColumns = columns => {
    const parsedColumns = columns.map(column => {
      return {
        title: column.title,
      };
    });
    return parsedColumns;
  };

  parseRows = rows => {
    const parsedRows = rows.map(row => {
      return {
        cells: Object.values(row),
      };
    });
    return parsedRows;
  };

  onSelect = (event, isSelected, rowId) => {
    const { rows } = this.state;

    let selectedRows;
    if (rowId === -1) {
      selectedRows = rows.map(oneRow => {
        // eslint-disable-next-line no-param-reassign
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      selectedRows = [...rows];
      selectedRows[rowId].selected = isSelected;
    }
    this.setState({
      rows: selectedRows,
    });
  };

  toggleSelect = checked => {
    this.setState({
      canSelectAll: checked,
    });
  };

  render() {
    const { loading, onRow, ...childProps } = this.props;
    const { canSelectAll, cells, rows, actions } = this.state;

    return (
      <React.Fragment>
        <PatternFlyTable
          aria-label="Table"
          variant={TableVariant.compact}
          cells={cells}
          rows={rows}
          actions={actions}
          canSelectAll={canSelectAll}
          onSelect={this.onSelect}
          {...childProps}
        >
          <TableHeader />
          <TableBody />
        </PatternFlyTable>
        <Checkbox
          label="canSelectAll"
          isChecked={canSelectAll}
          onChange={this.toggleSelect}
          aria-label="toggle select all checkbox"
          id="toggle-select-all"
          name="toggle-select-all"
        />
      </React.Fragment>
    );
  }
}
