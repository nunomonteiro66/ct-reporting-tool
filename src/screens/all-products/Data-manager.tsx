import PrimaryButton from '@commercetools-uikit/primary-button';
import Filters, { FiltersProps } from '../../components/filters/filters';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { exportToExcel } from '../../utils/export-excel';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { ColumnVisibility, Table } from '@tanstack/react-table';
import { TProduct } from '../../types/product';
import { Column } from '../../types/datatable-column';
import { AttributeComplete } from '../../utils/mappers/map-with-attributes';
import { sortByKeyOrder } from '../../utils/sorting';

type OptionProps = { value: string; label: string };

type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;

type DataManagerProps = {
  data: TProduct[];
  columns: Column[];
  uniqueAttributes: AttributeComplete[];
  languages: string[];
  setLanguages: Dispatch<SetStateAction<string[]>>;
};

export const DataManager = ({
  data,
  columns,
  uniqueAttributes,
  languages,
  setLanguages,
}: DataManagerProps) => {
  //table state
  const tableRef = useRef<Table<TProduct> | null>(null);

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  //set the filters config
  //set the active columns
  useEffect(() => {
    //set the options for the filters
    const languagesOptions = languages.map((lang) => ({
      label: lang,
      value: lang,
    }));
    setFiltersConfig((prev) => [
      /* ...prev, */
      {
        filterKey: 'attributes',
        label: 'Attributes',
        options: uniqueAttributes.map((attr) => ({
          value: attr.value,
          label: Array.isArray(attr.label) ? attr.label.join('\n') : attr.label,
        })),
      },
      {
        filterKey: 'languages',
        label: 'Languages',
        options: languagesOptions,
      },
    ]);

    //all languages are on by default
    setAppliedFilters([
      {
        filterKey: 'languages',
        values: languagesOptions,
      },
    ]);

    setActiveColumns((prev) =>
      columns.filter((col) => col.isVisible ?? true).map((col) => col.key)
    );
  }, []);

  //change filters when active columns change
  useEffect(() => {
    const attributesOptions = filtersConfig.find(
      (filter) => filter.filterKey === 'attributes'
    )?.options;
    if (!attributesOptions) return;

    const activeColumnsAttributes = activeColumns
      .filter((col) => col.startsWith('attributes'))
      .map((col) => col.split('.')[1]);

    const newActiveColumns = attributesOptions.filter((attr) =>
      activeColumnsAttributes.includes(attr.value)
    );

    if (newActiveColumns.length > 0)
      setAppliedFilters((prev) => [
        ...prev.filter((f) => f.filterKey !== 'attributes'),
        { filterKey: 'attributes', values: newActiveColumns },
      ]);
    else
      setAppliedFilters((prev) => [
        ...prev.filter((f) => f.filterKey !== 'attributes'),
      ]);
  }, [activeColumns]);

  const exportExcel = async () => {
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

  //when the attributes filters change, replace the active columns
  const changeAttributesShown = (selectedOptions: OptionProps[]) => {
    //remove all attributes from selected columns
    let newActiveColumns = activeColumns.filter(
      (col) => !col.startsWith('attributes.')
    );

    selectedOptions.forEach((filter) => {
      newActiveColumns.push(`attributes.${filter.value}.value`);
    });

    //reorder the active columns
    setActiveColumns(newActiveColumns);
  };

  const filtersChanged: SubmitCallbackProps = (key, selectedOptions) => {
    switch (key) {
      case 'attributes':
        //when attributes change, change the columns shown
        changeAttributesShown(selectedOptions);
        break;
      //sets the language(s) for the attributes values. if empty, show all
      case 'languages':
        setLanguages(selectedOptions.map((opt) => opt.value));
        break;
    }

    setAppliedFilters((prev) => [
      ...prev.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ]);
  };

  useEffect(() => {
    console.log(filtersConfig, appliedFilters);
  }, [filtersConfig, appliedFilters]);

  return (
    <>
      <div>
        <PrimaryButton label="Export Excel" onClick={() => exportExcel()} />
        <Filters
          appliedFilters={appliedFilters}
          filtersConfig={filtersConfig}
          submitCallback={filtersChanged}
        />
      </div>
      <TanstackTable
        data={data}
        columns={columns}
        visibleColumns={activeColumns}
        setVisibleColumns={setActiveColumns}
        setTable={(t) => {
          tableRef.current = t;
        }}
      />
    </>
  );
};
