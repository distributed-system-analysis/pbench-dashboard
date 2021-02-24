import React from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import matchSorter from 'match-sorter';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@patternfly/patternfly/patternfly.css';
import './index.less';

import SearchBar from '../SearchBar';
import Pagination from '../Pagination';

function GlobalFilter({ preGlobalFilteredRows, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const onChange = useAsyncDebounce(result => {
    setGlobalFilter(result || undefined);
  }, 200);

  return (
    <SearchBar
      onSearch={searchValue => {
        onChange(searchValue);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function DefaultColumnFilter() {
  return <></>;
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = val => !val;

function Table({ columns, data, onRowClick }) {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      disableMultiSort: true,
      initialState: { pageSize: 20 },
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,

    hooks => {
      hooks.visibleColumns.push(visibleColumns => {
        return [
          {
            id: 'selection',
            groupByBoundary: true,
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...visibleColumns,
        ];
      });
    }
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <br />
      <table className="pf-c-table pf-m-compact pf-m-grid-md" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '* ' : ''}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => onRowClick(row.original)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '↓' : '→'}
                          </span>{' '}
                          {cell.render('Cell', { editable: false })} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell', { editable: false })
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        itemCount={data.length}
        onFirstClick={() => gotoPage(0)}
        onPreviousClick={() => previousPage()}
        onNextClick={() => nextPage()}
        onLastClick={() => gotoPage(pageCount - 1)}
        onPerPageSelect={selectedPageSize => setPageSize(selectedPageSize)}
        onSetPage={pageNumber => gotoPage(pageNumber)}
      />
    </>
  );
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(
    () => {
      resolvedRef.current.indeterminate = indeterminate;
    },
    [resolvedRef, indeterminate]
  );

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

function TableWrapper(props) {
  const { columns, data, onRowClick } = props;

  return (
    <React.Fragment>
      <Table columns={columns} data={data} onRowClick={onRowClick} />
    </React.Fragment>
  );
}

export default TableWrapper;
