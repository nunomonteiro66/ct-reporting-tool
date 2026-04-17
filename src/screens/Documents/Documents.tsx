import { useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Table } from '@tanstack/react-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import Filters, { FiltersProps } from '../../components/filters/filters';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { FilterSubmitCallbackProps } from '../../types/filter';
import DataPageLayout from '../../layouts/data-page-layout';
import { getAsset } from '../../utils/get-asset-type';
import { Column } from '../../types/datatable-column';
import { getProductSelections } from '../../utils/mappers/miscellaneous';
import { Asset } from '../../types/asset';

type DocumentProduct = {
  sku: string | null | undefined;
  product_name: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  assets: Record<string, Record<string, { name: string; link: string }>>;
  selections: string[];
  revision: string;
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
  { key: 'revision', label: 'Document Revision' },
  { key: 'type', label: 'Type' },
  { key: 'product_type_key', label: 'Product Type Key' },
  { key: 'product_type_name', label: 'Product Type Name' },
  { key: 'categories', label: 'Product categories' },
  { key: 'selections', label: 'Product Selections' },
];

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
      /* const data = (await getProductDocuments(0, 1, ['172547020D1000'])).data
        ?.results; */
      const mapped = extractData(data as CTProduct[]);

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
      changeLanguageColumns(finalColumns, ['en']);

      //filters
      setDefaultFilters(allLangs);

      //all types are enabled by default
      setActiveColumns(finalColumns.map((col) => col.key));

      setLoading(false);
    };
    load();
  }, []);

  const extractData = (products: CTProduct[]) => {
    return products.flatMap((prod) => {
      const current = prod.masterData.current;
      const prodType = prod.productType;
      return (
        prod.masterData.current?.allVariants.flatMap((variant) => {
          //assets organized by revision number
          const assets = variant.assets.reduce((acc, asset) => {
            const mapped = getAsset(asset);
            if (!mapped) return acc;

            const revNum = mapped.revisionNumber ?? 1; //files without revision number have only one revision, ergo 1
            acc[revNum] = [...(acc[revNum] ?? []), mapped];
            return acc;
          }, {} as Record<number, Asset[]>);

          return Object.entries(assets).map(([revisionNumber, assets]) => ({
            key: variant.key,
            sku: variant.sku,
            product_name: current?.name,
            type: variant.attributesRaw[0]?.value ?? '',
            product_type_key: prodType?.key,
            product_type_name: prodType?.name,
            categories: current?.categories.map((cat) => cat.name),
            //add the product selections
            selections: getProductSelections(
              prod.productSelectionRefs.results,
              variant.sku ?? ''
            ),
            revision: revisionNumber,
            assets: assets.reduce((acc, asset) => {
              const type = asset.type ?? '';
              acc[type] = {
                ...acc[type],
                ...asset.languages.reduce((acc2, lang) => {
                  acc2[lang.toLowerCase()] = {
                    name: asset.name,
                    link: asset.url,
                  };
                  return acc2;
                }, {} as Record<string, { name: string; link: string; revision?: number }>),
              };
              return acc;
            }, {} as Record<string, Record<string, { name: string; link: string }>>),
          }));
        }) ?? []
      );
    });
  };

  //active columns depend on the selected languages, or if there are no documents in that language for the current search
  const changeLanguageColumns = (
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
    //setActiveColumns(newColumns.map((col) => col.key));
    setColumns(newColumns);
  };

  const changeActiveTypes = (selectedTypes: string[]) => {
    setActiveColumns((prev) =>
      originalColumns
        .map((col) => col.key)
        .filter(
          (col) =>
            !col.startsWith('assets.') ||
            selectedTypes.includes(col.split('.')[1])
        )
    );
  };

  const filtersChanged: FilterSubmitCallbackProps = (key, selectedOptions) => {
    switch (key) {
      case 'languages':
        changeLanguageColumns(
          originalColumns,
          selectedOptions.map((opt) => opt.value)
        );
        break;
      case 'types':
        changeActiveTypes(selectedOptions.map((opt) => opt.value));
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
      {
        filterKey: 'types',
        label: 'Document types',
        options: defaultAssets.map((asset) => ({
          value: asset.key,
          label: asset.label,
        })),
      },
    ]);

    //only english is active by default
    //all document types are active by default
    const englishOption = languagesOptions.find((lang) => lang.value === 'en');
    if (englishOption)
      setAppliedFilters([
        {
          filterKey: 'languages',
          values: [englishOption],
        },
        {
          filterKey: 'types',
          values: defaultAssets.map((asset) => ({
            value: asset.key,
            label: asset.label,
          })),
        },
      ]);
  };

  const handleTableChange = (table: Table<DocumentProduct>) => {
    setTotalResults(table.getRowCount());
  };

  const clearAllFilters = () => {
    filtersChanged('languages', []);
    filtersChanged('types', []);
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
            numberColsPinned={4}
          />
        </DataPageLayout>
      )}
    </>
  );
};

Documents.displayName = 'Documents';

export default Documents;
