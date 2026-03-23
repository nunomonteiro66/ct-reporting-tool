import { useEffect, useRef, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct, TAsset } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { Table } from '@tanstack/react-table';
import { TProduct } from '../../types/product';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import Filters, { FiltersProps } from '../../components/filters/filters';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { FilterSubmitCallbackProps } from '../../types/filter';

type ImageProduct = {
  sku: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  images: Record<string, Record<string, string>>;
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

const VariantImages = () => {
  //table state
  const tableRef = useRef<Table<TProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(defaultColumns);

  const { getAllProductsDocuments } = useProductsGraphql();

  const [data, setData] = useState<ImageProduct[]>([]);

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
            images: variant.assets
              .filter((asset) => asset.sources[0].contentType === 'image')
              .reduce((acc, asset, index) => {
                acc[index] = {
                  name: asset.name ?? '',
                  link: asset.sources[0].uri,
                };
                return acc;
              }, {} as Record<string, { name: string; link: string }>),
          };
        }) ?? []
      );
    });
  };

  useEffect(() => {
    const load = async () => {
      const data = await getAllProductsDocuments();
      const mapped = extractData(data);

      console.log(mapped);

      setData(mapped);
      console.log(mapped);

      //the product with most images dictates the total columns
      const max_images = mapped.length
        ? Math.max(...mapped.map((map) => Object.keys(map.images).length))
        : 0;

      const extraColumns = Array.from({ length: max_images }, (_, i) => [
        { key: `images.${i}.name`, label: `Image ${i + 1}` },
        { key: `images.${i}.link`, label: `Image ${i + 1} link` },
      ]).flat();

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
          <div>
            <PrimaryButton
              label="Export Excel"
              onClick={() => exportTableExcel(tableRef, columns)}
            />
          </div>
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

VariantImages.displayName = 'Images';

export default VariantImages;
