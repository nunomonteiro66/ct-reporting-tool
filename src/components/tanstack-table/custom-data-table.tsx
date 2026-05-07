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
import { WarningMessage } from '@commercetools-uikit/messages';
import { getColumnsKeysWithoutNA } from '../../utils/helpers';

type CustomDataTableProps<T> = {
  data: T[];
  pinnedColumns?: string[];
  useContext: () => TableContextType<T>;
};

const CustomDataTable = <T extends Record<string, unknown>>({
  data,
  useContext,
  pinnedColumns = [],
}: CustomDataTableProps<T>) => {
  const {
    state: {
      columns,
      visibleColumns,
      columnOrder,
      selectedLanguages,
      table,
      pagination,
      appliedFilters,
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
  const [naCols, setNacols] = useState(0); //number of attribute columns that are hidden because they only have N/A values

  //checks if a column has only N/A values
  //if it has, hide and show a message
  useEffect(() => {
    if (!table) return;

    if (hideNa) {
      //get applied attributes
      const appliedAttributes = Object.entries(appliedFilters).find(
        ([key]) => key === 'attributes'
      );
      if (!appliedAttributes) return;

      //get only the attributes that should be shown
      const visibleAttributesCols = appliedAttributes[1].map(
        (attr) => `attributes.${attr}`
      );
      const visibleWithoutNA = getColumnsKeysWithoutNA(
        visibleAttributesCols,
        table
      );
      setNacols(visibleAttributesCols.length - visibleWithoutNA.length);

      setVisibleColumns([
        //non attribute columns are always visible
        ...visibleColumns.filter((col) => !col.startsWith('attributes.')),
        ...visibleWithoutNA,
      ]);
    }
  }, [table?.getSortedRowModel(), appliedFilters, hideNa]);

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

  const finalPinnedColumns = useMemo(
    () =>
      pinnedColumns.map((pinCol) => {
        const column = columns.find((col) => col.key === pinCol);

        if (!column) return '';

        //column without children
        if (!column?.children) return pinCol;

        //column with children, pin the en columns, or the first (in case en isn't selected)
        return `${pinCol}.${
          selectedLanguages.includes('en') ? 'en' : selectedLanguages[0]
        }`;
      }),
    [selectedLanguages]
  );

  //for the columns orderer component, the attributes columns needs the label + code
  const columnsFullLabel = useMemo(
    () =>
      columns.map((col) => {
        if (!col.children || !col.key.startsWith('attributes.')) return col;

        const enLabel = col.children
          .find((child) => child.key === 'en')
          ?.label.split('(en)')[0]
          .trim();
        const label = enLabel ? `${enLabel} (${col.label})` : col.label;

        return {
          ...col,
          label: label,
        };
      }),
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
              setHideNa(value);
            }}
            label="Hide NA only columns"
          />
        )}
      </div>

      {naCols != 0 && (
        <WarningMessage>Hidden {naCols} attribute columns</WarningMessage>
      )}

      <TanstackTable
        data={data}
        columns={columns}
        visibleColumns={fullVisibleColumns}
        columnOrder={fullColumnOrder}
        setTable={setTable}
        onTableChange={handleTableChange}
        pinnedColumns={finalPinnedColumns}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
};

export default CustomDataTable;
