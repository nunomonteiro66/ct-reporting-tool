import { useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Table } from '@tanstack/react-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import DataPageLayout from '../../layouts/data-page-layout';
import { getProductSelectionsNames } from '../../utils/mappers/miscellaneous';

type ImageProduct = {
  sku: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  images: {
    name: string;
    link: string;
    order: number;
  }[];
};

const defaultColumns = [
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'key', label: 'Key' },
  { key: 'product_name', label: 'Product Name' },
  { key: 'type', label: 'Type' },
  { key: 'product_type_key', label: 'Product Type Key' },
  { key: 'product_type_name', label: 'Product Type Name' },
  { key: 'categories', label: 'Product categories' },
  { key: 'selections', label: 'Product Selections' },
];

const Images = () => {
  //table state
  const tableRef = useRef<Table<ImageProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(defaultColumns);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const { getAllProductsImages } = useProductsGraphql();

  const [data, setData] = useState<ImageProduct[]>([]);

  //total results after filtering
  const [totalResults, setTotalResults] = useState<number>(0);

  const extractData = (products: CTProduct[]) => {
    return products.flatMap((prod) => {
      const current = prod.masterData.current;
      const prodType = prod.productType;
      return (
        current?.allVariants.map((variant) => {
          return {
            key: prod.key,
            sku: variant.sku,
            product_name: current?.name,
            type: variant.attributesRaw[0]?.value ?? '',
            product_type_key: prodType?.key,
            product_type_name: prodType?.name,
            categories: current?.categories.map((cat) => cat.name),
            selections: getProductSelectionsNames(
              prod.productSelectionRefs.results.map(
                (res) => res.productSelection?.name ?? ''
              )
            ),
            images: variant.assets
              .filter((asset) => {
                const custom = asset.custom?.customFieldsRaw;
                return custom && custom.length > 0;
              })
              .map((asset) => {
                return {
                  name: asset.name ?? '',
                  link: asset.sources[0].uri,
                  order: Number(asset.custom?.customFieldsRaw![0].value[0]),
                };
              })
              .sort((asset, asset2) => asset.order - asset2.order),
          };
        }) ?? []
      );
    });
  };

  //build all the extra columns for the images
  const buildExtraColumns = (len: number) =>
    Array.from({ length: len }, (_, i) => [
      { key: `images.${i}.name`, label: `Image ${i + 1}` },
      { key: `images.${i}.link`, label: `Image ${i + 1} link` },
    ]).flat();

  useEffect(() => {
    const load = async () => {
      const data = await getAllProductsImages();
      const mapped = extractData(data);
      setData(mapped);

      //the product with most images dictates the total columns
      const max_images = mapped.length
        ? Math.max(...mapped.map((map) => Object.keys(map.images).length))
        : 0;

      const columns = [...defaultColumns, ...buildExtraColumns(max_images)];
      setColumns(columns);
      setVisibleColumns(columns.map((col) => col.key));

      setLoading(false);
    };
    load();
  }, []);

  const handleTableChange = (table: Table<ImageProduct>) => {
    setTotalResults(table.getRowCount());
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <DataPageLayout
          title="Images"
          totalResults={totalResults}
          actions={
            <PrimaryButton
              label="Export Excel"
              onClick={() =>
                exportTableExcel(tableRef, columns, visibleColumns)
              }
            />
          }
        >
          <TanstackTable
            data={data}
            initialColumns={columns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            setTable={(t) => {
              tableRef.current = t;
            }}
            onTableChange={handleTableChange}
            dynamicColumns
          />
        </DataPageLayout>
      )}
    </>
  );
};

Images.displayName = 'Images';

export default Images;
