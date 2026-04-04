import {
  ColumnSettingsManager,
  TColumnData,
} from '@commercetools-uikit/data-table-manager';
import { useEffect, useState } from 'react';
import { Column } from '../../types/datatable-column';
import { Button } from '@headlessui/react';
import { ColumnsIcon } from '@commercetools-uikit/icons';
import flattenColumns from '../../utils/flatten-columns';

type ColumnOrderProps = {
  columns: Column[];
  visibleColumns: string[];
  setVisibleColumns: any;
  columnOrder: string[];
  setColumnOrder: any;
};

const ColumnOrder = ({
  columns,
  visibleColumns,
  setVisibleColumns,
  columnOrder,
  setColumnOrder,
}: ColumnOrderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isColumnVisible = (col: Column): boolean => {
    const keys = flattenColumns([col]);
    return keys.some((k) => visibleColumns.includes(k));
  };

  const sortByColumnOrder = (cols: Column[]) =>
    [...cols].sort((a, b) => {
      // For grouped columns, use the first flattened child key to find position
      const getOrder = (col: Column) => {
        const keys = flattenColumns([col]);
        const positions = keys
          .map((k) => columnOrder.indexOf(k))
          .filter((i) => i !== -1);
        return positions.length > 0 ? Math.min(...positions) : Infinity;
      };

      return getOrder(a) - getOrder(b);
    });

  const selectedColumns = sortByColumnOrder(
    columns.filter((c) => isColumnVisible(c))
  );

  const hiddenColumns = sortByColumnOrder(
    columns.filter((c) => !isColumnVisible(c))
  );

  const handleUpdateColumns = (updatedColumns: TColumnData[]) => {
    const keys = flattenColumns(updatedColumns);
    setVisibleColumns(keys);
    setColumnOrder(keys);
    console.log(keys);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <ColumnsIcon />
      </Button>
      {isOpen && (
        <ColumnSettingsManager
          selectedColumns={selectedColumns}
          availableColumns={hiddenColumns}
          onUpdateColumns={handleUpdateColumns}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ColumnOrder;
