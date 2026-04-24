import { Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import TanstackTable from './tanstack-table';
import SearchTextInput from '@commercetools-uikit/search-text-input';
import ColumnOrder from './column-order';
import {
  flattenColumnKeys,
  flattenColumnKeysByLanguage,
} from '../../utils/flatten-columns';
import { useTableContext } from '../../screens/AllProducts/context';
import { orderColumnsByKeys } from '../../utils/sorting';

type CustomDataTableProps<T> = {
  data: T[];
};

const CustomDataTable = <T extends Record<string, unknown>>({
  data,
}: CustomDataTableProps<T>) => {
  const {
    state: { columns, visibleColumns, columnOrder, selectedLanguages, table },
    actions: { setTotalResults, setVisibleColumns, setColumnOrder, setTable },
  } = useTableContext();

  const [globalFilter, setGlobalFilter] = useState('');

  //visible columns keys with the children
  //only set visible the children with selected language
  const fullVisibleColumns = useMemo(
    () =>
      flattenColumnKeysByLanguage(
        columns.filter((col) => visibleColumns.includes(col.key)),
        selectedLanguages
      ),
    [visibleColumns, selectedLanguages]
  );

  //leaf columns order
  const fullColumnOrder = useMemo(
    () => flattenColumnKeys(orderColumnsByKeys(columns, columnOrder)),
    [columnOrder]
  );

  //pinned leaf columns
  const pinnedColumns = useMemo(
    () =>
      flattenColumnKeys(orderColumnsByKeys(columns, columnOrder).slice(0, 3)),
    [columnOrder, visibleColumns]
  );

  const handleTableChange = (table: Table<T>) => {
    setTotalResults(table.getRowCount());
  };

  useEffect(() => {
    console.log('PINNED CHANGED: ', pinnedColumns);
  }, [pinnedColumns]);

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-col items-end">
        <SearchTextInput
          value={globalFilter ?? ''}
          onSubmit={(e) => setGlobalFilter(e)}
          onReset={() => setGlobalFilter('')}
        />
        <ColumnOrder
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
      </div>

      <TanstackTable
        data={data}
        columns={columns}
        visibleColumns={fullVisibleColumns}
        columnOrder={fullColumnOrder}
        setTable={setTable}
        onTableChange={handleTableChange}
        globalFilter={globalFilter}
        pinnedColumns={pinnedColumns}
      />
    </div>
  );
};

export default CustomDataTable;
