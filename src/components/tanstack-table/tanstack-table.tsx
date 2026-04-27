import {
  ColumnFiltersState,
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
  ColumnPinningState,
  Row,
} from '@tanstack/react-table';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import Pagination from './pagination';
import { Column } from '../../types/datatable-column';
import getNestedValue from '../../utils/nested-attributes';
import { flattenColumnKeys, flattenColumns } from '../../utils/flatten-columns';
import getCommonPinningStyles from './column-pin';
import ColumnHeader from './column-header';
import ColumnFiltersTags from './column-filters-tags';
import { getColumnsKeysWithoutNA } from '../../utils/helpers';
import { WarningMessage } from '@commercetools-uikit/messages';

type TanstackTableProps<T> = {
  data: T[];
  columns: Column[];
  visibleColumns: string[];
  //setVisibleColumns: Dispatch<SetStateAction<string[]>>;
  columnOrder: string[];
  //setColumnOrder: (value: string[]) => void;
  setTable: Dispatch<SetStateAction<Table<T> | null>>;
  onTableChange?: (t: Table<T>) => void;
  pinnedColumns: string[];
  /* globalSearchFn: (
    row: Row<T>,
    columnId: string,
    filterValue: string
  ) => boolean; */
};

//text: search term
//value: column to filter by (if undefined, use all)
export type GlobalFilter = {
  text: string;
  value?: string;
  exactMatch: boolean;
};

const TanstackTable = <T extends Record<string, unknown>>({
  data,
  columns,
  visibleColumns,
  columnOrder,
  setTable,
  onTableChange,
  pinnedColumns,
}: /* globalSearchFn, */
TanstackTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = useState<GlobalFilter>({
    text: '',
    exactMatch: false,
  });

  const [naCols, setNacols] = useState(0); //number of attribute columns that are hidden because they only have N/A values

  //state for the tanstacktable
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>();

  //state for the pinned columns
  //default is the first three columns
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});

  //checks if a column has only N/A values
  //if it has, hide and show a message
  const checkColumnsNA = () => {
    if (!table) return;
    const visibleWithoutNA = getColumnsKeysWithoutNA(visibleColumns, table);
    setNacols(visibleColumns.length - visibleWithoutNA.length);
    changeColumnVisibility(visibleWithoutNA);
  };

  const changeColumnVisibility = (visibleColumns: string[]) => {
    let columnVisibility = Object.fromEntries(
      flattenColumnKeys(columns).map((key) => [
        key,
        visibleColumns.some((visibleKey) => key === visibleKey),
      ])
    );

    setColumnVisibility(columnVisibility);
  };

  useEffect(() => {
    table.setPageSize(20);
    setTable(table);
  }, []);

  //sets the column visibility based on visibleColumns from the parent
  //if a key in visibleColumns points to a group, all group children are shown
  useEffect(() => {
    if (!visibleColumns) return;

    changeColumnVisibility(visibleColumns);

    setColumnPinning({
      left: pinnedColumns,
    });
  }, [visibleColumns, columns, columnOrder]);

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

    return columns.map((col) => buildColumn(col));
  }, [columns]);

  const globalSearchFn = (
    row: Row<T>,
    columnId: string,
    filterValue: GlobalFilter
  ) => {
    if (!filterValue || filterValue.text.trim() === '') return true;
    if (filterValue.value && filterValue.value != columnId) return false;
    const rowValue = String(row.getValue(columnId));

    const searchTerm = filterValue.text.trim();
    const exactMatch = filterValue.exactMatch;

    if (searchTerm.includes(',')) {
      const filterArray = searchTerm
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      return filterArray.some((filter) =>
        exactMatch
          ? rowValue === filter
          : rowValue.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return exactMatch
      ? rowValue === searchTerm
      : rowValue.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const table = useReactTable({
    data,
    columns: newColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      columnOrder,
      columnPinning,
    },
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    //onColumnOrderChange: setColumnOrder,
    //onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalSearchFn,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  //callback when the table data changes (f.e, when filtering in the columns)
  //or when the visible columns changes
  useEffect(() => {
    onTableChange?.(table);
  }, [table.getRowModel().rows]);

  useEffect(() => {
    checkColumnsNA();
  }, [visibleColumns, columnFilters, table.getAllColumns(), globalFilter]);

  return (
    <>
      {naCols != 0 && (
        <WarningMessage>Hidden {naCols} attribute columns</WarningMessage>
      )}
      <ColumnFiltersTags
        columns={flattenColumns(columns)}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
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
                      /* this header is a group header (simple header, with no filters/sorting/...) */
                      <th
                        key={header.id}
                        id={header.column.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles(header.column, header),
                          width: header.getSize(),
                        }}
                        //style={{ ...getCommonPinningStyles(header.column) }}
                        className="px-4 py-2 font-semibold text-center border-r-2 border-r-[#e2e8f0] overflow-hidden text-ellipsis bg-white"
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
                    colSpan={columns.length}
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
                        style={{
                          ...getCommonPinningStyles(cell.column),
                        }}
                        key={cell.id}
                        className="py-2.75 px-4 text-[#334155] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-w-65 align-middle bg-white"
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
    </>
  );
};

export default TanstackTable;
