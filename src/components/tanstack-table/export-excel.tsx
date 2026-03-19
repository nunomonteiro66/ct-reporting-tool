import { RefObject } from 'react';
import { Column } from '../../types/datatable-column';
import { Table } from '@tanstack/react-table';
import { exportToExcel } from '../../utils/export-excel';
import { sortByKeyOrder } from '../../utils/sorting';

const exportTableExcel = (
  tableRef: RefObject<Table<any>>,
  columns: Column[]
) => {
  const tableState = tableRef.current?.getState();
  if (!tableState) return;

  const activeColumns = Object.keys(tableState.columnVisibility).filter(
    (key) => tableState.columnVisibility[key]
  );

  //give only the visible columns
  let visibleColumns = activeColumns
    .map((colKey) => columns.find((col) => col.key === colKey))
    .filter((col): col is Column => col !== undefined);

  visibleColumns = sortByKeyOrder(
    visibleColumns,
    tableRef.current?.getState().columnOrder ?? [],
    'key'
  );

  //get the filtered data from the table
  const toExport = tableRef.current
    ?.getFilteredRowModel()
    .rows.map((row) => row.original);

  exportToExcel(toExport, visibleColumns, 'excel-export');
};

export default exportTableExcel;
