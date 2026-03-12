import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import s from './styles.module.css';
import ColumnHeader from './column-header';
import Pagination from './pagination';

type Column = {
  key: string;
  label: string;
};

type TanstackTableProps<T> = {
  data: T[];
  columns: Column[];
  visibleColumns: string[];
  onFilterChange: (filters: ColumnFiltersState) => void;
};

// Resolves dot-notation paths like "product.name" on a nested object
const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object')
      return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
};

const TanstackTable = <T extends Record<string, unknown>>({
  data,
  columns,
  visibleColumns,
  onFilterChange,
}: TanstackTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  useEffect(() => {
    setColumnVisibility(
      Object.fromEntries(
        columns.map((col) => [col.key, visibleColumns.includes(col.key)])
      )
    );
  }, [visibleColumns]);

  const columnHelper = createColumnHelper<T>();

  const newColumns = columns.map((col) =>
    columnHelper.accessor(
      (row) => getNestedValue(row as Record<string, unknown>, col.key),
      {
        id: col.key,
        header: col.label,
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(String(row.getValue(columnId)));
        },
      }
    )
  );

  const table = useReactTable({
    data,
    columns: newColumns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(20);
  }, []);

  const getUniqueValues = (key: string): string[] =>
    Array.from(
      new Set(
        data.map((row) =>
          String(getNestedValue(row as Record<string, unknown>, key) ?? '')
        )
      )
    ).sort();

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
    onFilterChange(filters());
  };

  return (
    <div className={s.component}>
      {/* <div>
        <SecondaryIconIconButton icon={<TableIcon />} label="Reorder Columns" />
        <SortableList items={} />
      </div> */}
      <div className={s.wrapper}>
        <div className={s.tableContainer}>
          <table className={s.table}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <ColumnHeader
                      key={header.column.id}
                      header={header}
                      openFilter={openFilter}
                      setOpenFilter={setOpenFilter}
                      activeFilters={getActiveFilters(header.column.id)}
                      uniqueValues={getUniqueValues(header.column.id)}
                      onFilterSubmit={handleFilterSubmit}
                    />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={s.emptyCell}>
                    No results found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`${s.tr} ${i % 2 === 0 ? s.trEven : s.trOdd}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={s.td}>
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
      <Pagination table={table} />
    </div>
  );
};

export default TanstackTable;
