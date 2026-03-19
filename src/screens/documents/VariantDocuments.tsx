import { useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct, TAsset } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Table } from '@tanstack/react-table';
import { TProduct } from '../../types/product';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';

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

const typeMap = {
  DOP000077: 'dop',
  DOC000004: 'doc',
  'Data sheet metadata type': 'datasheet',
  'EPD metadata type': 'epd',
};

const VariantDocuments = () => {
  //table state
  const tableRef = useRef<Table<TProduct> | null>(null);

  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(defaultColumns);
  const { getAllProductsDocuments } = useProductsGraphql();
  const { getAllLanguagesCodes } = useProjectGraphql();

  const [data, setData] = useState<DocumentProduct[]>([]);

  const getDocumentType = (asset: TAsset) => {
    const values = asset.custom?.customFieldsRaw?.map(
      (field) => field.value[0]
    );
    if (values) {
      return typeMap[
        values.find((item) => item && item in typeMap) as keyof typeof typeMap
      ];
    }
  };

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
              const fileType = getDocumentType(asset);
              if (fileType) {
                const lang = asset.tags[0].toLowerCase();
                const link = asset.sources[0].uri;
                const fileName = asset.name;
                acc[lang] = {
                  ...acc[lang],
                  [`${fileType}_name`]: fileName,
                  [`${fileType}_link`]: link,
                };
              }
              return acc;
            }, {} as Record<string, Record<string, string>>),
          };
        }) ?? []
      );
    });
  };

  useEffect(() => {
    const load = async () => {
      const allLang = await getAllLanguagesCodes();
      const data = await getAllProductsDocuments();
      const mapped = extractData(data);

      setData(mapped);
      console.log(mapped);

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

      setColumns([...defaultColumns, ...extraColumns]);

      console.log([...defaultColumns, ...extraColumns]);

      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <>
          <TanstackTable
            data={data}
            columns={columns}
            setTable={(t) => {
              tableRef.current = t;
            }}
          />
        </>
      )}
    </>
  );
};

export default VariantDocuments;
