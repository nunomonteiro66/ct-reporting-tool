import { Children, useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct, TAsset } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Table } from '@tanstack/react-table';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import Filters, { FiltersProps } from '../../components/filters/filters';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { FilterSubmitCallbackProps } from '../../types/filter';
import DataPageLayout from '../../layouts/data-page-layout';
import getNestedValue from '../../utils/nested-attributes';
import { getAsset } from '../../utils/get-asset-type';
import { Column } from '../../types/datatable-column';

type DocumentProduct = {
  sku: string | null | undefined;
  product_name: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  assets: Record<string, Record<string, string>>;
};

const defaultColumns: Column[] = [
  {
    key: 'key',
    label: 'Key',
  },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'product_name', label: 'Product Name' },
  { key: 'type', label: 'Type' },
  { key: 'product_type_key', label: 'Product Type Key' },
  { key: 'product_type_name', label: 'Product Type Name' },
  { key: 'categories', label: 'Product categories' },
];

/* const defaultAssets = [
  { key: 'datasheet_name', label: 'Datasheet' },
  { key: 'datasheet_link', label: 'Datasheet link' },

  { key: 'dop_name', label: 'DOP' },
  { key: 'dop_link', label: 'DOP link' },

  { key: 'doc_name', label: 'DOC' },
  { key: 'doc_link', label: 'DOC link' },

  { key: 'epd_name', label: 'EPD' },
  { key: 'epd_link', label: 'EPD link' },
]; */

/* const defaultAssets = [
  {
    key: 'datasheet',
    label: 'Datasheet',
    children: [
      {
        key: 'en',
        label: 'EN',
        children: [
          { key: 'name', label: 'Name' },
          { key: 'link', label: 'Link' },
        ],
      },
    ],
  },
]; */

const defaultAssets = [
  { key: 'datasheet', label: 'Datasheet' },
  { key: 'dop', label: 'DOP' },
  { key: 'doc', label: 'DOC' },
  { key: 'epd', label: 'EPD' },
];

const Documents = () => {
  //table state
  const tableRef = useRef<Table<DocumentProduct> | null>(null);

  const [loading, setLoading] = useState(true);

  const [originalColumns, setOriginalColumns] = useState(defaultColumns);
  const [columns, setColumns] = useState(defaultColumns);
  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  const { getAllProductsDocuments, getProductDocuments } = useProductsGraphql();

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [data, setData] = useState<DocumentProduct[]>([]);

  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const data = await getAllProductsDocuments();
      const mapped = extractData(data);

      setData(mapped);

      //get all the possible languages (from the mapped documents)
      const allLangs = [
        ...new Set(
          mapped.flatMap((product) =>
            Object.values(product.assets).flatMap((asset) => Object.keys(asset))
          )
        ),
      ];

      //add extra columns for the assets
      const extraColumns: Column[] = defaultAssets.map((asset) => ({
        key: `assets.${asset.key}`,
        label: asset.label,
        children: allLangs.map((lang) => ({
          key: lang,
          label: lang.toUpperCase(),
          children: [
            { key: 'name', label: 'Name' },
            { key: 'link', label: 'Link' },
          ],
        })),
      }));

      const finalColumns = [...defaultColumns, ...extraColumns];

      setOriginalColumns(finalColumns);

      //only en is enabled by default
      changeActiveColumns(finalColumns, ['en']);

      //filters
      setDefaultFilters(allLangs);

      setLoading(false);
    };
    load();
  }, []);

  const extractData = (products: CTProduct[]) => {
    return products.flatMap((prod) => {
      const current = prod.masterData.current;
      const prodType = prod.productType;
      return (
        prod.masterData.current?.allVariants.map((variant) => {
          return {
            key: variant.key,
            sku: variant.sku,
            product_name: current?.name,
            type: variant.attributesRaw[0]?.value ?? '',
            product_type_key: prodType?.key,
            product_type_name: prodType?.name,
            categories: current?.categories.map((cat) => cat.name),
            assets: variant.assets.reduce((acc, asset) => {
              const cAsset = getAsset(asset);
              if (cAsset) {
                acc[cAsset.type ?? ''] = cAsset.languages.reduce(
                  (acc2, lang) => {
                    acc2[lang.toLowerCase()] = {
                      name: cAsset.name,
                      link: cAsset.url,
                    };
                    return acc2;
                  },
                  {} as Record<string, { name: string; link: string }>
                );
              }
              return acc;
            }, {} as Record<string, Record<string, { name: string; link: string }>>),
          };
        }) ?? []
      );
    });
  };

  //active columns depend on the selected languages, or if there are no documents in that language for the current search
  const changeActiveColumns = (
    columns: Column[],
    selectedLanguages: string[]
  ) => {
    //return only the columns that aren't assets, or that are assets of a selected language
    const newColumns = columns
      .map((col) => {
        if (col.key.startsWith('assets.')) {
          return {
            ...col,
            children: col.children?.filter((child) =>
              selectedLanguages.includes(child.key)
            ),
          };
        }
        return col;
      })
      .filter(
        (col) =>
          !col.key.startsWith('assets.') ||
          (col.children && col.children.length > 0)
      );

    console.log('NEW COLUMNS ARE: ', newColumns);

    setActiveColumns(newColumns.map((col) => col.key));
    setColumns(newColumns);
  };

  const filtersChanged: FilterSubmitCallbackProps = (key, selectedOptions) => {
    switch (key) {
      case 'languages':
        changeActiveColumns(
          originalColumns,
          selectedOptions.map((opt) => opt.value)
        );
        break;
    }

    setAppliedFilters((prev) => [
      ...prev.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ]);
  };

  const setDefaultFilters = (languages: string[]) => {
    const languagesOptions = languages.map((lang) => ({
      label: lang,
      value: lang,
    }));

    setFiltersConfig([
      {
        filterKey: 'languages',
        label: 'Languages',
        options: languagesOptions,
      },
    ]);

    //only english is active by default
    const englishOption = languagesOptions.find((lang) => lang.value === 'en');
    if (englishOption)
      setAppliedFilters([
        {
          filterKey: 'languages',
          values: [englishOption],
        },
      ]);
  };

  const handleTableChange = (table: Table<DocumentProduct>) => {
    /* const data = table
      .getFilteredRowModel()
      .flatRows.map((row) => row.original);
    let langs = [];

    columns
      .filter((col) => col.key.startsWith('assets.'))
      .forEach((col) => {
        const key = col.key;

        const result = data.some((entry) => getNestedValue(entry, key));
        if (result) {
          langs.push(key.split('.')[1]);
        }
      }); */

    setTotalResults(table.getRowCount());
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <DataPageLayout
          title="Documents"
          totalResults={totalResults}
          actions={
            <PrimaryButton
              label="Export Excel"
              onClick={() => {
                if (tableRef.current)
                  exportTableExcel(tableRef.current, 'documents');
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
            initialColumns={columns}
            visibleColumns={activeColumns}
            setVisibleColumns={setActiveColumns}
            setTable={(t) => {
              tableRef.current = t;
            }}
            onTableChange={handleTableChange}
          />
        </DataPageLayout>
      )}
    </>
  );
};

Documents.displayName = 'Documents';

export default Documents;
