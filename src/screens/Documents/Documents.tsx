import { useEffect, useRef, useState } from 'react';
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

type DocumentProduct = {
  sku: string | null | undefined;
  product_name: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  assets: Record<string, Record<string, string>>;
};

const defaultColumns = [
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

const defaultAssets = [
  { key: 'datasheet_name', label: 'Datasheet' },
  { key: 'datasheet_link', label: 'Datasheet link' },

  { key: 'dop_name', label: 'DOP' },
  { key: 'dop_link', label: 'DOP link' },

  { key: 'doc_name', label: 'DOC' },
  { key: 'doc_link', label: 'DOC link' },

  { key: 'epd_name', label: 'EPD' },
  { key: 'epd_link', label: 'EPD link' },
];

const Documents = () => {
  //table state
  const tableRef = useRef<Table<DocumentProduct> | null>(null);

  const [loading, setLoading] = useState(true);

  const [originalColumns, setOriginalColumns] = useState(defaultColumns);
  const [columns, setColumns] = useState(defaultColumns);
  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  const { getAllProductsDocuments, getProductDocuments } = useProductsGraphql();
  const { getAllLanguagesCodes } = useProjectGraphql();

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [data, setData] = useState<DocumentProduct[]>([]);

  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const allLang = await getAllLanguagesCodes();
      const data = await getAllProductsDocuments();
      //const data = (await getProductDocuments(3, 1)).data.results;
      const mapped = extractData(data);

      setData(mapped);
      //add extra columns for the assets
      const extraColumns: typeof defaultColumns = [];
      allLang.forEach((lang) => {
        defaultAssets.forEach((asset) => {
          extraColumns.push({
            key: `assets.${lang}.${asset.key}`,
            label: `${asset.label} (${lang.toUpperCase()})`,
          });
        });
      });

      const finalColumns = [...defaultColumns, ...extraColumns];

      setOriginalColumns(finalColumns);

      //only en is enabled by default
      const enOnly = finalColumns.filter(
        (col) =>
          col.key.startsWith('assets.en.') || !col.key.startsWith('assets')
      );
      setColumns(enOnly);
      setActiveColumns(enOnly.map((col) => col.key));

      //filters
      setDefaultFilters(allLang);

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
            sku: variant.sku,
            product_name: current?.name,
            type: variant.attributesRaw[0]?.value ?? '',
            product_type_key: prodType?.key,
            product_type_name: prodType?.name,
            categories: current?.categories.map((cat) => cat.name),
            assets: variant.assets.reduce((acc, asset) => {
              const cAsset = getAsset(asset);
              if (cAsset)
                acc[cAsset.language] = {
                  ...acc[cAsset.language],
                  [`${cAsset.type}_name`]: cAsset.name ?? '',
                  [`${cAsset.type}_link`]: cAsset.url,
                };

              /* const fileType = getDocumentType(asset);
              if (fileType) {
                const lang = asset.tags[0].toLowerCase();
                const link = asset.sources[0].uri;
                const fileName = asset.name;
                acc[lang] = {
                  ...acc[lang],
                  [`${fileType}_name`]: fileName ?? '',
                  [`${fileType}_link`]: link,
                };
              } */
              return acc;
            }, {} as Record<string, Record<string, string>>),
          };
        }) ?? []
      );
    });
  };

  //active columns depend on the selected languages, or if there are no documents in that language for the current search
  const changeActiveColumns = (selectedLanguages: string[]) => {
    //return only the columns that aren't assets, or that are assets of a selected language
    const newColumns = originalColumns.filter(
      (col) =>
        !col.key.startsWith('assets.') ||
        selectedLanguages.some((lang) => col.key.startsWith(`assets.${lang}.`))
    );

    setActiveColumns(newColumns.map((col) => col.key));
    setColumns(newColumns);
  };

  const filtersChanged: FilterSubmitCallbackProps = (key, selectedOptions) => {
    switch (key) {
      case 'languages':
        changeActiveColumns(selectedOptions.map((opt) => opt.value));
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
    const data = table
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
      });

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
