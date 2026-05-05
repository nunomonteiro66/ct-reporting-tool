import { Row, Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import TanstackTable, { GlobalFilter } from './tanstack-table';
import ColumnOrder from './column-order';
import {
  flattenColumnKeys,
  flattenColumnKeysByLanguage,
} from '../../utils/flatten-columns';
import { orderColumnsByKeys } from '../../utils/sorting';
import Switch from '../switch';
import SelectableSearchInput from '@commercetools-uikit/selectable-search-input';
import { TableContextType } from '../../types/table-context';
import { isLocal } from '../../helpers';

type CustomDataTableProps<T> = {
  data: T[];
  useContext: () => TableContextType<T>;
};

const CustomDataTable = <T extends Record<string, unknown>>({
  data,
  useContext,
}: CustomDataTableProps<T>) => {
  const {
    state: {
      columns,
      visibleColumns,
      columnOrder,
      selectedLanguages,
      table,
      pagination,
    },
    actions: {
      setTotalResults,
      setVisibleColumns,
      setColumnOrder,
      setTable,
      setPagination,
    },
  } = useContext();

  const [hideNa, setHideNa] = useState(true);

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

  const pinnedColumns = useMemo(() => {
    const pinned = orderColumnsByKeys(columns, columnOrder).slice(0, 3);

    const finalCols = pinned.map((col) => {
      if (!col.children) return col;
      let en =
        col.children.find((child) => child.key === 'en') ?? col.children[0];

      return { ...col, children: [en] };
    });

    return flattenColumnKeys(finalCols);
  }, [columnOrder, visibleColumns]);

  //for the columns orderer component, use the full label (label translated + code)
  const columnsFullLabel = useMemo(
    () =>
      columns.map((col) =>
        col.children
          ? {
              ...col,
              label: `${
                col.children.find((child) => child.key === 'en')?.label
              } (${col.label})`,
            }
          : col
      ),
    [columns]
  );

  const handleTableChange = (table: Table<T>) => {
    setTotalResults(table.getRowCount());
  };

  const globalFilter = table?.getState().globalFilter ?? {
    text: '',
    value: '',
    exactMatch: false,
  };

  //can be used to only change one, or several fields
  const setGlobalFilter = (newGlobalFilter: Partial<GlobalFilter>) => {
    if (!table) return;
    table.setGlobalFilter((prev: GlobalFilter) => ({
      ...prev,
      ...newGlobalFilter,
    }));
  };

  const columnsOrderer = columns.map((col) => {
    if (!col.children) return col;
    return { ...col, label: col.children[0].label };
  });

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-col items-end">
        <div className="flex w-full gap-4 z-20">
          <Switch
            onChange={(value) => {
              setGlobalFilter({ exactMatch: value });
            }}
            label="Exact Match"
          />
          {/* <SearchBar value={globalFilter} onSubmit={setGlobalFilter} /> */}
          {/* <SearchTextInput
            value={globalFilter ?? ''}
            onSubmit={(e) => setGlobalFilter(e)}
            onReset={() => setGlobalFilter('')}
          /> */}

          <SelectableSearchInput
            options={[
              { value: '', label: 'All Columns' },
              ...columns.map((col) => ({
                value: col.key,
                label: col.label,
              })),
            ]}
            value={{
              text: globalFilter.text,
              option: globalFilter.value,
            }}
            onSubmit={(e) => {
              setGlobalFilter({ text: e.text, value: e.option });
            }}
          />
        </div>

        <ColumnOrder
          columns={columnsFullLabel}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
        {isLocal && (
          <Switch
            enabled={hideNa}
            onChange={(value) => {
              console.log('CHANGING NA COLS: ', value);
              setHideNa(value);
            }}
            label="Hide NA only columns"
          />
        )}
      </div>

      <TanstackTable
        data={data}
        columns={columns}
        visibleColumns={fullVisibleColumns}
        columnOrder={fullColumnOrder}
        setTable={setTable}
        onTableChange={handleTableChange}
        pinnedColumns={pinnedColumns}
        pagination={pagination}
        setPagination={setPagination}
        hideNaCols={hideNa}
      />
    </div>
  );
};

export default CustomDataTable;
