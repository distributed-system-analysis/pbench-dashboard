import React, { PureComponent } from 'react';
import {
  Table as PatternFlyTable,
  TableHeader,
  TableBody,
  TableVariant,
  sortable,
  SortByDirection,
} from '@patternfly/react-table';
import { Bullseye, Spinner, Pagination } from '@patternfly/react-core';
import SearchBar from '../SearchBar';

export default class Table extends PureComponent {
  constructor(props) {
    super(props);

    const { dataSource, columns, actions } = props;

    this.defaultPerPage = 20;
    this.defaultRows = this.parseRows(dataSource);
    this.state = {
      cells: this.parseColumns(columns),
      rows: this.defaultRows.slice(0, this.defaultPerPage),
      actions,
      sortBy: {},
      page: 1,
      perPage: this.defaultPerPage,
    };
  }

  onSetPage = (event, newPage, perPage, startIdx, endIdx) => {
    const { dataSource } = this.props;
    const rows = this.parseRows(dataSource);

    this.setState({
      page: newPage,
      rows: rows.slice(startIdx, endIdx),
    });
  };

  onPerPageSelect = (event, newPerPage, newPage, startIdx, endIdx) => {
    const { dataSource } = this.props;
    const rows = this.parseRows(dataSource);

    this.setState({
      perPage: newPerPage,
      page: newPage,
      rows: rows.slice(startIdx, endIdx),
    });
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
    const { onRowClick } = this.props;

    const parsedRows = rows.map(row => {
      const rowArray = Object.values(row).map((cell, index) => {
        if (index === 0) {
          return {
            title: <a onClick={() => onRowClick(cell)}>{cell}</a>,
          };
        }
        return {
          title: <p>{cell}</p>,
        };
      });
      return {
        cells: rowArray,
        favorited: true,
      };
    });
    return parsedRows;
  };

  render() {
    const { loading, ...childProps } = this.props;
    const { cells, rows, actions, sortBy, page, perPage } = this.state;

    return (
      <React.Fragment>
        <SearchBar style={{ marginRight: 32 }} placeholder="Search" onSearch={this.onSearch} />
        <Pagination
          isCompact
          itemCount={this.defaultRows.length}
          page={page}
          perPage={perPage}
          onSetPage={this.onSetPage}
          onPerPageSelect={this.onPerPageSelect}
          perPageOptions={[
            { title: '20', value: 20 },
            { title: '50', value: 50 },
            { title: '100', value: 100 },
            { title: '200', value: 200 },
          ]}
          titles={{
            paginationTitle: `top pagination`,
          }}
        />
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
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          ) : (
            <React.Fragment>
              <TableHeader />
              <TableBody />
            </React.Fragment>
          )}
        </PatternFlyTable>
      </React.Fragment>
    );
  }
}
