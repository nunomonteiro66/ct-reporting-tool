import {
  ColumnFiltersState,
  ColumnOrderState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
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
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  //states for the column order component
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>();
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    initialColumns.map((col) => col.key)
  );

  //state for the tanstacktable
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  //if visibleColumns is undefined, set all columns on
  useEffect(() => {
    if (!visibleColumns) return;
    setVisibleColumnKeys(initialColumns.map((col) => col.key));
    setColumnVisibility(
      Object.fromEntries(
        initialColumns.map((col) => [col.key, visibleColumns.includes(col.key)])
      )
    );
  }, []);

  useEffect(() => {
    if (!visibleColumnKeys) return;
    setColumnVisibility(
      Object.fromEntries(
        initialColumns.map((col) => [
          col.key,
          visibleColumnKeys.includes(col.key),
        ])
      )
    );
  }, [visibleColumnKeys]);

  useEffect(() => {
    setVisibleColumnKeys(visibleColumns);
  }, [visibleColumns]);
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

  const buildColumn = (col: Column, parentKey = ''): any => {
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

  const newColumns = useMemo(
    () => initialColumns.map((col) => buildColumn(col)),
    [initialColumns]
  );

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

  useEffect(() => {
    table.setPageSize(20);
    setTable(table);
  }, [table]);

  useEffect(() => {
    onTableChange?.(table);
  }, [table.getRowModel()]);

  const getUniqueValues = (key: string): string[] => {
    const allValues = data.flatMap((row) => {
      const nested = getNestedValue(row as Record<string, unknown>, key);
      if (Array.isArray(nested)) return nested.map(String);
      return [String(nested ?? '')];
    });

    return Array.from(new Set(allValues)).sort();
  };

  const getActiveFilters = (key: string): string[] => {
    const filter = columnFilters.find((f) => f.id === key);
    return (filter?.value as string[]) ?? [];
  };

  const handleFilterSubmit = (columnKey: string, values: string[]) => {
    const filters = () => {
      const without = columnFilters.filter((f) => f.id !== columnKey);
      if (values.length === 0) return without;
      return [...without, { id: columnKey, value: values }];
    };

    setColumnFilters(filters());
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
          visibleColumns={visibleColumnKeys ?? []}
          setVisibleColumns={(columns: string[]) => {
            setVisibleColumnKeys(columns);
            if (setVisibleColumns) setVisibleColumns(columns); //parent
          }}
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
                  {hg.headers.map((header) =>
                    header.isPlaceholder || header.column.columns.length > 0 ? (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                        className="px-4 py-2 font-semibold text-center border-r-2 border-r-[#e2e8f0] bg-[#f8fafc]"
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </th>
                    ) : (
                      <ColumnHeader
                        key={header.column.id}
                        header={header}
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                        activeFilters={getActiveFilters(header.column.id)}
                        uniqueValues={getUniqueValues(header.column.id)}
                        onFilterSubmit={handleFilterSubmit}
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
                    {row.getVisibleCells().map((cell) => (
                      <td
                        style={{ width: cell.column.getSize() }}
                        key={cell.id}
                        className="py-2.75 px-4 text-[#334155] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-w-65 align-middle"
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
