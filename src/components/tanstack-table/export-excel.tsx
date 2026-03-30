import { RefObject } from 'react';
import { Column } from '../../types/datatable-column';
import { Table } from '@tanstack/react-table';
import { exportToExcel } from '../../utils/export-excel';
import { sortByKeyOrder } from '../../utils/sorting';

const exportTableExcel = (
  tableRef: RefObject<Table<any> | null>,
  columns: Column[],
  visibleColumnsKeys?: string[]
) => {
  const tableState = tableRef.current?.getState();
  if (!tableState) return;

  const { columnVisibility, columnOrder } = tableState;

  //keys of the visible columns
  const activeKeys = columnVisibility
    ? Object.keys(columnVisibility).filter((key) => columnVisibility[key])
    : columns.map((col) => col.key);

  //give only the visible columns (Column complete)
  let visibleColumns = (visibleColumnsKeys ?? activeKeys)
    .map((colKey) => columns.find((col) => col.key === colKey))
    .filter((col): col is Column => col !== undefined);

  //sort the columns as in the table
  visibleColumns = sortByKeyOrder(visibleColumns, columnOrder ?? [], 'key');

  //get the filtered data from the table
  const toExport = tableRef.current
    ?.getFilteredRowModel()
    .rows.map((row) => row.original);

  exportToExcel(toExport, visibleColumns, 'excel-export');
};

export default exportTableExcel;
