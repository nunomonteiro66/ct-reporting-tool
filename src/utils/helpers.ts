import { Table } from '@tanstack/react-table';
import { Column } from '../types/datatable-column';

//checks if the column doesn't have any values
const isColumnOnlyNA = <T>(table: Table<T>, columnId: string) => {
  const values = [
    ...(table.getColumn(columnId)?.getFacetedUniqueValues().keys() ?? []),
  ];
  return values.length === 1 && values[0] === 'N/A';
};

//check if filters caused a column to be redundant (only have 'N/A' for all values)
//if this is the case, hide the column
export const getActiveColumnsWithoutNA = <T>(
  table: Table<T>,
  columns: Column[],
  activeColumns: string[]
) => {
  //because of the languages filter, sometimes the activeColumns array has non existing columns
  //(for example: name.da doesn't exist if the languages are only set for en)
  const currentColumns = columns.map((col) => col.key);
  const existingActiveColumns = activeColumns.filter((actCol) =>
    currentColumns.includes(actCol)
  );

  return existingActiveColumns.filter((col) => !isColumnOnlyNA(table, col));
};
