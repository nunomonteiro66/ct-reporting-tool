import {
  ColumnSettingsManager,
  TColumnData,
} from '@commercetools-uikit/data-table-manager';
import { useEffect, useState } from 'react';
import { Column } from '../../types/datatable-column';
import { Button } from '@headlessui/react';
import { ColumnsIcon } from '@commercetools-uikit/icons';

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

  const sortByColumnOrder = (cols: Column[]) =>
    [...cols].sort((a, b) => {
      const indexA = columnOrder.indexOf(a.key);
      const indexB = columnOrder.indexOf(b.key);
      // Columns not in columnOrder fall to the end
      const posA = indexA === -1 ? Infinity : indexA;
      const posB = indexB === -1 ? Infinity : indexB;
      return posA - posB;
    });

  const selectedColumns = sortByColumnOrder(
    columns.filter((c) => visibleColumns.includes(c.key))
  );

  const hiddenColumns = sortByColumnOrder(
    columns.filter((c) => !visibleColumns.includes(c.key))
  );

  useEffect(() => {
    columns.filter((c) => visibleColumns.includes(c.key));
  }, [visibleColumns]);

  const handleUpdateColumns = (updatedColumns: TColumnData[]) => {
    const keys = updatedColumns.map((c) => c.key);
    setVisibleColumns(keys);
    setColumnOrder(keys);

    console.log(updatedColumns, keys, selectedColumns, hiddenColumns);
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
