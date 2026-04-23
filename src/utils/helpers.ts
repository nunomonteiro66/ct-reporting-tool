import { Header, Table } from '@tanstack/react-table';
import { Column } from '../types/datatable-column';

//checks if the column doesn't have any values
export const isColumnOnlyNA = <T>(table: Table<T>, columnId: string) => {
  const columnDef = table.getColumn(columnId);

  if (!columnDef || columnDef.columns.length > 0) {
    const childColumnsIds = columnDef?.columns.map((col) => col.id);
    return childColumnsIds?.some((child) => isColumnOnlyNA(table, child));
  }

  const values = [
    ...(table.getColumn(columnId)?.getFacetedUniqueValues().keys() ?? []),
  ];

  return values.length === 1 && values[0] === 'N/A';
};

//returns an array of the active columns, without the columns that only have "N/A"
export const getColumnsKeysWithoutNA = <T>(
  activeColumns: string[],
  table: Table<T>
) => {
  //hide the columns that only have N/A values
  if (table)
    return activeColumns.filter((colKey) => !isColumnOnlyNA(table, colKey));
  return [];
};
