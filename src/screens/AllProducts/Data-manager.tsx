import PrimaryButton from '@commercetools-uikit/primary-button';
import Filters, { FiltersProps } from '../../components/filters/filters';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { Table } from '@tanstack/react-table';
import { Column } from '../../types/datatable-column';
import { AttributeComplete } from '../../utils/mappers/map-with-attributes';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import { MappedProduct } from '../../types/mapped-product';
import DataPageLayout from '../../layouts/data-page-layout';

type OptionProps = { value: string; label: string };

type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;

type DataManagerProps = {
  data: MappedProduct[];
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
  const tableRef = useRef<Table<MappedProduct> | null>(null);

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  const [totalResults, setTotalResults] = useState<number>(0);

  //set the filters config
  //set the active columns
  useEffect(() => {
    //set the options for the filters
    const languagesOptions = languages.map((lang) => ({
      label: lang,
      value: lang,
    }));
    setFiltersConfig([
      {
        filterKey: 'attributes',
        label: 'Attributes',
        options: uniqueAttributes.map((attr) => ({
          value: Array.isArray(attr.value) ? attr.value.join('\n') : attr.value,
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

    setActiveColumns(
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

    setAppliedFilters((prev) => {
      const isEqual = (a: OptionProps[], b: OptionProps[]) => {
        if (a.length !== b.length) return false;
        return a.every((val, i) => val.value === b[i]?.value);
      };
      const existing = prev.find((f) => f.filterKey === 'attributes');

      if (
        existing &&
        isEqual(existing.values as OptionProps[], newActiveColumns)
      ) {
        return prev;
      }

      if (newActiveColumns.length === 0) {
        return prev.filter((f) => f.filterKey !== 'attributes');
      }

      return [
        ...prev.filter((f) => f.filterKey !== 'attributes'),
        { filterKey: 'attributes', values: newActiveColumns },
      ];
    });
  }, [activeColumns]);

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

  const handleTableChange = (table: Table<MappedProduct>) => {
    setTotalResults(table.getRowCount());
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setLanguages([]);

    // reset columns
    setActiveColumns(
      columns
        .filter((col) => !col.key.startsWith('attributes'))
        .map((col) => col.key)
    );
  };

  return (
    <DataPageLayout
      title="Products"
      totalResults={totalResults}
      actions={
        <PrimaryButton
          label="Export Excel"
          onClick={() => exportTableExcel(tableRef, columns)}
        />
      }
    >
      <Filters
        appliedFilters={appliedFilters}
        filtersConfig={filtersConfig}
        submitCallback={filtersChanged}
        clearAllCallback={clearAllFilters}
      />
      <TanstackTable
        data={data}
        initialColumns={columns}
        visibleColumns={activeColumns}
        setVisibleColumns={setActiveColumns}
        setTable={(t) => {
          tableRef.current = t;
        }}
        onTableChange={handleTableChange}
      />
    </DataPageLayout>
  );
};
