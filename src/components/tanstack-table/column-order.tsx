import {
  ColumnSettingsManager,
  TColumnData,
} from '@commercetools-uikit/data-table-manager';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@headlessui/react';
import { ColumnsIcon } from '@commercetools-uikit/icons';
import { TColumn } from '@commercetools-uikit/data-table';
import { orderColumnsByKeys } from '../../utils/sorting';

type ColumnOrderProps = {
  columns: TColumn[];
  visibleColumns: string[];
  setVisibleColumns: (values: string[]) => void;
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

  const sortedColumns = orderColumnsByKeys(columns, columnOrder);

  const selectedColumns = sortedColumns.filter((c) =>
    visibleColumns.includes(c.key)
  );

  const hiddenColumns = sortedColumns.filter(
    (c) => !visibleColumns.includes(c.key)
  );

  const handleUpdateColumns = (updatedColumns: TColumnData[]) => {
    const newKeys = updatedColumns.map((col) => col.key);
    setVisibleColumns(newKeys);
    setColumnOrder(newKeys);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} id="column-orderer-button">
        <ColumnsIcon />
      </Button>
      {isOpen && (
        <ColumnSettingsManager
          selectedColumns={selectedColumns} //this component only sees the key and lable (ignores the children)
          availableColumns={hiddenColumns}
          onUpdateColumns={handleUpdateColumns}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ColumnOrder;
