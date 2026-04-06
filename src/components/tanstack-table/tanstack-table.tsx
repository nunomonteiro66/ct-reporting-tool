import {
  ColumnFiltersState,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import ColumnHeader from './column-header';
import Pagination from './pagination';
import SearchTextInput from '@commercetools-uikit/search-text-input';
import { Column } from '../../types/datatable-column';
import ColumnOrder from './column-order';
import getNestedValue from '../../utils/nested-attributes';
import flattenColumns from '../../utils/flatten-columns';

type TanstackTableProps<T> = {
  data: T[];
  initialColumns: Column[];
  visibleColumns: string[];
  setVisibleColumns: Dispatch<SetStateAction<string[]>>;
  setTable: (t: Table<T>) => void;
  onTableChange?: (t: Table<T>) => void;
};

const TanstackTable = <T extends Record<string, unknown>>({
  data,
  initialColumns,
  visibleColumns,
  setVisibleColumns,
  setTable,
  onTableChange,
}: TanstackTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  //states for the column order component
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    flattenColumns(initialColumns)
  );

  //state for the tanstacktable
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  useEffect(() => {
    table.setPageSize(20);
    setTable(table);
  }, []);

  //sets the column visibility based on visibleColumns from the parent
  //if a key in visibleColumns points to a group, all group children are shown
  useEffect(() => {
    if (!visibleColumns) return;
    setColumnVisibility(
      Object.fromEntries(
        flattenColumns(initialColumns).map((key) => [
          key,
          visibleColumns.some(
            (visibleKey) =>
              key === visibleKey || // exact match
              key.startsWith(visibleKey + '.') // key is a child of visibleKey
          ),
        ])
      )
    );
  }, [visibleColumns, initialColumns]);

  //the columns transformed for the table
  const newColumns = useMemo(() => {
    const buildColumn = (col: Column, parentKey = ''): any => {
      const columnHelper = createColumnHelper<T>();

      const makeLeaf = (col: Column) =>
        columnHelper.accessor(
          (row) => getNestedValue(row as Record<string, unknown>, col.key),
          {
            id: col.key,
            header: Array.isArray(col.label) ? col.label.join('\n') : col.label,
            size: 100,
            minSize: 150,
            maxSize: 1000,
            filterFn: (row, columnId, filterValue: string[]) => {
              if (!filterValue || filterValue.length === 0) return true;
              const cellValue = row.getValue(columnId);
              const cellArray = Array.isArray(cellValue)
                ? cellValue.map(String)
                : [String(cellValue ?? '')];
              return filterValue.some((v) => cellArray.includes(v));
            },
          }
        );

      const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;

      if (col.children && col.children.length > 0) {
        return columnHelper.group({
          id: fullKey,
          header: col.label,
          columns: col.children.map((child) => buildColumn(child, fullKey)),
        });
      }

      return makeLeaf({ ...col, key: fullKey });
    };

    return initialColumns.map((col) => buildColumn(col));
  }, [initialColumns, visibleColumns]);

  const table = useReactTable({
    data,
    columns: newColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      columnOrder,
    },
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue: string) => {
      if (!filterValue || filterValue.trim() === '') return true;
      const value = String(row.getValue(columnId)).toLowerCase();

      if (filterValue.includes(',')) {
        const filterArray = filterValue
          .split(',')
          .map((f) => f.trim().toLowerCase())
          .filter(Boolean);

        return filterArray.some((filter) => value.includes(filter));
      }
      return value.includes(filterValue.toLowerCase());
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  //callback for the parent
  useEffect(() => {
    onTableChange?.(table);
  }, [table.getRowModel()]);

  //helper for the sticky columns (the first 3)
  const getStickyLeft = (index: number) => {
    // Accumulate widths of prior sticky columns
    // Using default column size of 100 as fallback
    return table
      .getVisibleLeafColumns()
      .slice(0, index)
      .reduce((acc, col) => acc + col.getSize(), 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-end">
        <SearchTextInput
          value={globalFilter ?? ''}
          onSubmit={(e) => setGlobalFilter(e)}
          onReset={() => setGlobalFilter('')}
        />
        <ColumnOrder
          columns={initialColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
      </div>

      <div className="font-sans text-[13px] text-[#1a2027] border border-[#e2e8f0] rounded-md overflow-visible shadow-sm bg-white h-full">
        <div className="overflow-x-auto h-full max-h-[calc(100vh-200px)] overflow-y-auto">
          <table
            style={{ width: table.getTotalSize() }}
            className="border-separate table-fixed"
          >
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header, index) =>
                    header.isPlaceholder || header.column.columns.length > 0 ? (
                      /* this header is a group header (simple header, with no filters/sorting/...) */
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.getSize(),
                          position: index < 3 ? 'sticky' : 'relative',
                          left:
                            index < 3 ? `${getStickyLeft(index)}px` : undefined,
                          zIndex: index < 3 ? 20 : 10,
                        }}
                        className="px-4 py-2 font-semibold text-center border-r-2 border-r-[#e2e8f0] bg-[#f8fafc] overflow-hidden text-ellipsis"
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </th>
                    ) : (
                      <ColumnHeader
                        header={header}
                        data={data}
                        columnFilters={columnFilters}
                        setColumnFilters={setColumnFilters}
                        sticky={index < 3}
                        stickyLeft={
                          index < 3 ? getStickyLeft(index) : undefined
                        }
                      />
                    )
                  )}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={initialColumns.length}
                    className="py-10 px-4 text-center text-[#94a3b8] text-[13px]"
                  >
                    No results found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`transition-colors duration-100 border-b border-[#f1f5f9] hover:bg-[#f0f5ff] ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                    }`}
                  >
                    {row.getVisibleCells().map((cell, colIndex) => (
                      <td
                        style={{
                          width: cell.column.getSize(),
                          position: colIndex < 3 ? 'sticky' : 'relative',
                          left:
                            colIndex < 3
                              ? `${getStickyLeft(colIndex)}px`
                              : undefined,
                          zIndex: colIndex < 3 ? 1 : 0,
                        }}
                        key={cell.id}
                        className="py-2.75 px-4 text-[#334155] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-w-65 align-middle bg-inherit"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2">
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default TanstackTable;
