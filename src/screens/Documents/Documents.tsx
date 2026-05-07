import { useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import DataPageLayout from '../../layouts/data-page-layout';
import { getAsset } from '../../utils/get-asset-type';
import { Column } from '../../types/datatable-column';
import { getProductSelections } from '../../utils/mappers/miscellaneous';
import { Asset } from '../../types/asset';
import CustomDataTable from '../../components/tanstack-table/custom-data-table';
import Filters from './Filters';
import { useTableContext } from './context';
import { DocumentProduct } from '../../types/documents';

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
  const {
    state: { loading, table },
    actions: { setColumns, setVisibleColumns, setLoading },
  } = useTableContext();

  const { getAllProductsDocuments, getProductDocuments } = useProductsGraphql();

  const [data, setData] = useState<DocumentProduct[]>([]);

  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      //const data = await getAllProductsDocuments();
      const data = (await getProductDocuments(0, 1, ['172547020D1000'])).data
        ?.results;
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
      setLanguages(allLangs);

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

      setColumns(finalColumns);

      //only en is enabled by default
      //changeLanguageColumns(finalColumns, ['en']);

      //all types are enabled by default
      setVisibleColumns(finalColumns.map((col) => col.key));

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

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <DataPageLayout
          title="Documents"
          actions={
            <PrimaryButton
              label="Export Excel"
              onClick={() => {
                if (table) {
                  setLoading(true);
                  setTimeout(() => {
                    exportTableExcel(table, 'products-documents');
                    setLoading(false);
                  }, 0);
                  setLoading(false);
                }
              }}
            />
          }
        >
          <Filters languages={languages} defaultAssets={defaultAssets} />
          <CustomDataTable data={data} useContext={useTableContext} />
        </DataPageLayout>
      )}
    </>
  );
};

Documents.displayName = 'Documents';

export default Documents;
