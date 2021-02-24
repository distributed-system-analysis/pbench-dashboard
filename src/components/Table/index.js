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

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(result => {
    setGlobalFilter(result || undefined);
  }, 200);

  return (
    <span style={{ width: 500 }}>
      Search:{' '}
      <input
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter() {
  return <></>;
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

// Be sure to pass our updateMyData and the skipReset option
function Table({ columns, data, updateMyData, skipReset }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
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
      // Let's set up our default Filter UI
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
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    hooks => {
      hooks.visibleColumns.push(visibleColumns => {
        return [
          {
            id: 'selection',
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
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

  // Render the UI for your table
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="pf-c-table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '* ' : ''}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
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
              <tr {...row.getRowProps()} onClick={() => console.log(row.original)}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '↓' : '→'}
                          </span>{' '}
                          {cell.render('Cell', { editable: false })} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
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
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number';

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
  const { columns, data } = props;

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false);

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(
    () => {
      skipResetRef.current = false;
    },
    [data]
  );

  return (
    <React.Fragment>
      <Table columns={columns} data={data} skipReset={skipResetRef.current} />
    </React.Fragment>
  );
}

export default TableWrapper;
