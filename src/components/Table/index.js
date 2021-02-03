import React, { PureComponent } from 'react';
import {
  Table as PatternFlyTable,
  TableHeader,
  TableBody,
  TableVariant,
  sortable,
  SortByDirection,
} from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core';
import SearchBar from '../SearchBar';

export default class Table extends PureComponent {
  constructor(props) {
    super(props);

    const { dataSource, columns, actions } = props;

    this.state = {
      cells: this.parseColumns(columns),
      rows: this.parseRows(dataSource),
      actions,
      sortBy: {},
    };
  }

  parseColumns = columns => {
    const parsedColumns = columns.map(column => {
      return {
        title: column.title,
        transforms: [sortable],
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

  onSearch = searchValue => {
    const { dataSource } = this.props;
    const rows = this.parseRows(dataSource);
    const reg = new RegExp(searchValue, 'gi');
    const rowSearch = rows.slice();
    this.setState({
      rows: rowSearch
        .map(record => {
          const match = record.cells[0].match(reg);
          if (!match) {
            return null;
          }
          return record;
        })
        .filter(record => record !== null),
    });
  };

  onSort = (event, index, direction) => {
    const { dataSource } = this.props;
    const rows = this.parseRows(dataSource);
    const sortedRows = rows.sort(
      (a, b) =>
        typeof a.cells[index - 1] === 'string'
          ? a.cells[index - 1].localeCompare(b.cells[index - 1])
          : a.cells[index - 1] - b.cells[index - 1]
    );
    this.setState({
      sortBy: {
        index,
        direction,
      },
      rows: direction === SortByDirection.asc ? sortedRows : sortedRows.reverse(),
    });
  };

  onRowClick = (event, row) => {
    const { onRowClick } = this.props;
    onRowClick(row[0]);
  };

  render() {
    const { loading, ...childProps } = this.props;
    const { cells, rows, actions, sortBy } = this.state;

    return (
      <React.Fragment>
        <SearchBar style={{ marginRight: 32 }} placeholder="Search" onSearch={this.onSearch} />
        <PatternFlyTable
          aria-label="Table"
          variant={TableVariant.compact}
          cells={cells}
          rows={rows}
          actions={actions}
          sortBy={sortBy}
          onSort={this.onSort}
          canSelectAll
          onSelect={this.onSelect}
          {...childProps}
        >
          {loading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <TableHeader />
              <TableBody onRowClick={this.onRowClick} />
            </React.Fragment>
          )}
        </PatternFlyTable>
      </React.Fragment>
    );
  }
}
