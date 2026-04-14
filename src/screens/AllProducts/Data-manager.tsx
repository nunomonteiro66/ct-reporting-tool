import PrimaryButton from '@commercetools-uikit/primary-button';
import Filters, { FiltersProps } from '../../components/filters/filters';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { Table } from '@tanstack/react-table';
import { Column } from '../../types/datatable-column';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import { MappedProduct } from '../../types/mapped-product';
import DataPageLayout from '../../layouts/data-page-layout';
import { AttributeComplete } from '../../types/attribute';
import { isColumnOnlyNA } from '../../utils/helpers';
import { Category } from '../../types/category';

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
  categories: Category[];
};

export const DataManager = ({
  data,
  columns,
  uniqueAttributes,
  languages,
  setLanguages,
  categories,
}: DataManagerProps) => {
  //table state
  const tableRef = useRef<Table<MappedProduct> | null>(null);

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  const [totalResults, setTotalResults] = useState<number>(0);

  const [columnsCopy, setColumnsCopy] = useState(columns);

  const [loading, setLoading] = useState(false);

  //set the default filters config
  //set the default active columns
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
      {
        filterKey: 'categories',
        label: 'Categories',
        options: categories.map((cat) => ({
          label:
            (cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name) ?? '',
          value: cat.key ?? '',
        })),
      },
    ]);

    //only english is applied by default
    const englishOption = languagesOptions.find((lang) => lang.value === 'en');
    if (englishOption) filtersChanged('languages', [englishOption]);

    setActiveColumns(
      columnsCopy.filter((col) => col.isVisible ?? true).map((col) => col.key)
    );
  }, []);

  //change filters when active columns change
  //also hide columns that only have "N/A"
  useEffect(() => {
    const attributesOptions = filtersConfig.find(
      (filter) => filter.filterKey === 'attributes'
    )?.options;
    if (!attributesOptions) return;

    const activeColumnsAttributes = activeColumns
      .filter((col) => col.startsWith('attributes'))
      .map((col) => col.split('.')[1]);

    let newActiveColumns = attributesOptions.filter((attr) =>
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

  //returns an array of the active columns, without the columns that only have "N/A"
  const getColumnsKeysWithoutNA = (activeColumns: string[]) => {
    //hide the columns that only have N/A values
    if (tableRef.current)
      return activeColumns.filter(
        (colKey) => !isColumnOnlyNA(tableRef.current!, colKey)
      );
    return [];
  };

  //when the attributes filters change, replace the active columns
  const changeAttributesShown = (selectedAttributes: string[]) => {
    //remove all attributes columns from active columns
    let newActiveColumns = activeColumns.filter(
      (col) => !col.startsWith('attributes.')
    );

    newActiveColumns = [
      ...newActiveColumns,
      ...selectedAttributes.flatMap((opt) => [`attributes.${opt}`]),
    ];

    //hide the columns that only have N/A values
    newActiveColumns = getColumnsKeysWithoutNA(newActiveColumns);

    setActiveColumns(newActiveColumns);
  };

  //only keep children with the selected languages
  const changeLanguagesShown = (langs: string[]) => {
    let newColumns: Column[] = [];

    //no language selected, remove all columns with children
    if (langs.length === 0) {
      newColumns = columns.filter((col) => !col.children);
    } else {
      newColumns = columns.map((col) => {
        if (!col.children) return col;

        return {
          ...col,
          children: col.children.filter((child) => langs.includes(child.key)),
        };
      });
    }

    setColumnsCopy(newColumns);
  };

  const changeAttributesByCategory = (selectedOptions: OptionProps[]) => {
    console.log('SELECTED OPTION FOR CAT: ', selectedOptions);
    const keys = selectedOptions.map((opt) => opt.value);

    //get the categories
    const selectedCategories = categories.filter((cat) =>
      keys.includes(cat.key ?? '')
    );

    const newAttributesKeys = [
      ...new Set(
        selectedCategories.flatMap((cat) => cat.facetAttributeKeys ?? [])
      ),
    ];

    changeAttributesShown(newAttributesKeys);
  };

  const filtersChanged: SubmitCallbackProps = (key, selectedOptions) => {
    switch (key) {
      case 'attributes':
        changeAttributesShown(selectedOptions.map((opt) => opt.value));
        break;
      case 'languages':
        changeLanguagesShown(selectedOptions.map((opt) => opt.value));
        break;
      case 'categories':
        changeAttributesByCategory(selectedOptions);
        break;
    }

    const newAppliedFilters = [
      ...appliedFilters.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ];

    setAppliedFilters(newAppliedFilters);
  };

  const handleTableChange = (table: Table<MappedProduct>) => {
    setTotalResults(table.getRowCount());

    //check if any column can be hidden (columns with only N/A)
    setActiveColumns((prev) => getColumnsKeysWithoutNA(prev));
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setLanguages([]);

    // reset columns
    changeAttributesShown([]);
    changeLanguagesShown([]);

    /* setActiveColumns(
      columns
        .filter((col) => !col.key.startsWith('attributes') && !col.children) //since all languages are removed, no children should be visible
        .map((col) => col.key)
    ); */
  };

  return (
    <DataPageLayout
      title="Products"
      totalResults={totalResults}
      loading={loading}
      actions={
        <PrimaryButton
          label="Export Excel"
          onClick={() => {
            if (tableRef.current) {
              setLoading(true);
              setTimeout(() => {
                exportTableExcel(tableRef.current!, 'products-w-attributes');
                setLoading(false);
              }, 0);
              setLoading(false);
            }
          }}
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
        initialColumns={columnsCopy}
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
