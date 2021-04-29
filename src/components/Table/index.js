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
import { Bullseye, Spinner } from '@patternfly/react-core';
import { AngleDownIcon, AngleUpIcon } from '@patternfly/react-icons';
import { matchSorter } from 'match-sorter';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@patternfly/patternfly/patternfly.css';
import './index.less';

import RowSelection from '../RowSelection';
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
      style={{ marginBottom: 16 }}
      placeholder={`Search ${count} records...`}
    />
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

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = val => !val;

function Table({
  columns,
  data,
  isCheckable,
  onCompare,
  saveRuns,
  removeResultFromSeen,
  favoriteResult,
  deleteResult,
  loadingData,
  onRowClick,
}) {
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
      Filter: <></>,
    }),
    []
  );

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
    selectedFlatRows,
    state: { globalFilter, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      disableMultiSort: true,
      initialState: {
        pageSize: 20,
        pageIndex: 0,
        hiddenColumns: columns.map(column => {
          if (column.show === false) return column.accessor || column.id;
          return column;
        }),
      },
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
        if (isCheckable) {
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
                <div onClick={e => e.stopPropagation()}>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...visibleColumns,
          ];
        }
        return [...visibleColumns];
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
      {isCheckable && (
        <RowSelection
          selectedItems={Object.keys(selectedRowIds).length}
          compareActionName="Compare"
          onCompare={() => onCompare(selectedFlatRows)}
          saveRuns={() => saveRuns(selectedFlatRows)}
          removeResultFromSeen={() =>
            removeResultFromSeen(selectedFlatRows.map(item => item.original.result))
          }
          favoriteResult={() => favoriteResult(selectedFlatRows.map(item => item.original.result))}
          deleteResult={() => deleteResult(selectedFlatRows.map(item => item.original.result))}
        />
      )}
      {loadingData ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="pf-c-table pf-m-compact pf-m-grid-md" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      <div>
                        <span {...column.getSortByToggleProps()}>
                          {column.render('Header')}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <AngleDownIcon />
                            ) : (
                              <AngleUpIcon />
                            )
                          ) : (
                            ''
                          )}
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
                  <tr
                    className="pf-m-hoverable"
                    {...row.getRowProps()}
                    onClick={() => onRowClick && onRowClick(row.original)}
                  >
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
        </div>
      )}
      <Pagination
        itemCount={data.length}
        onFirstClick={() => gotoPage(1)}
        onPreviousClick={() => previousPage()}
        onNextClick={() => nextPage()}
        onLastClick={() => gotoPage(pageCount - 1)}
        onPerPageSelect={selectedPageSize => setPageSize(selectedPageSize)}
        onSetPage={pageNumber => gotoPage(pageNumber - 1)}
      />
    </>
  );
}

function TableWrapper(props) {
  return (
    <React.Fragment>
      <Table {...props} />
    </React.Fragment>
  );
}

export default TableWrapper;
