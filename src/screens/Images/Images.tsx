import { useEffect, useState } from 'react';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct as CTProduct } from '../../types/generated/ctp';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import { Table } from '@tanstack/react-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel, {
  exportTableExcelManually,
} from '../../components/tanstack-table/export-excel';
import DataPageLayout from '../../layouts/data-page-layout';
import { getProductSelections } from '../../utils/mappers/miscellaneous';
import CustomDataTable from '../../components/tanstack-table/custom-data-table';
import { useTableContext } from './context';
import { ImageProduct } from '../../types/images';

const defaultColumns = [
  { key: 'key', label: 'Key' },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'product_name', label: 'Product Name' },
  { key: 'type', label: 'Type' },
  { key: 'product_type_key', label: 'Product Type Key' },
  { key: 'product_type_name', label: 'Product Type Name' },
  { key: 'categories', label: 'Product Categories' },
  { key: 'selections', label: 'Product Selections' },
];

const Images = () => {
  const {
    state: {
      columns,
      loading,
      visibleColumns,
      totalResults,
      table,
      pagination,
    },
    actions: { setColumns, setLoading, setVisibleColumns, setTotalResults },
  } = useTableContext();

  const { getAllProductsImages } = useProductsGraphql();

  const [data, setData] = useState<ImageProduct[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllProductsImages();
      const mapped = extractData(data);
      setData(mapped);

      //the product with most images dictates the total columns
      const columns = [...defaultColumns, ...buildExtraColumns(mapped)];
      setColumns(columns);
      setVisibleColumns(columns.map((col) => col.key));

      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const nonEmptyAssets = getColumnsKeysNonEmpty(
      columns.map((col) => col.key).filter((col) => col.startsWith('images')),
      table
    );
    setVisibleColumns((prev) => [
      ...prev.filter((col) => !col.startsWith('images')),
      ...nonEmptyAssets,
    ]);
  }, [pagination]);

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
            selections: getProductSelections(
              prod.productSelectionRefs.results,
              variant.sku ?? ''
            ),

            images: variant.images
              .map((image) => {
                const url = image.url;
                const filename = decodeURIComponent(
                  url.split('/').at(-1)?.split('?')[0] ?? ''
                );

                const imageAsset = variant.assets.find(
                  (asset) => asset.sources[0].uri === url
                );
                let imageOrder = imageAsset?.custom?.customFieldsRaw?.find(
                  (custom) => custom.name === 'nkt_imageOrder'
                )?.value[0] as Number;

                return {
                  name: filename ?? '',
                  link: url,
                  order: imageOrder,
                };
              })
              .sort((asset, asset2) => asset.order - asset2.order),
          };
        }) ?? []
      );
    });
  };

  //build all the extra columns for the images
  const buildExtraColumns = (data: ImageProduct[]) => {
    const len = data.length
      ? Math.max(...data.map((map) => Object.keys(map.images).length))
      : 0;
    return Array.from({ length: len }, (_, i) => [
      { key: `images.${i}.name`, label: `Image ${i + 1}` },
      { key: `images.${i}.link`, label: `Image ${i + 1} link` },
    ]).flat();
  };

  const isColumnOnlyEmpty = (
    table: Table<ImageProduct>,
    columnId: string,
    pagination = true
  ) => {
    const columnDef = table.getColumn(columnId);

    if (!columnDef || columnDef.columns.length > 0) {
      const childColumnIds = columnDef?.columns.map((col) => col.id);
      return childColumnIds?.some((child) => isColumnOnlyEmpty(table, child));
    }

    // uses only current page rows
    const rows = pagination
      ? table.getPaginationRowModel().rows //only the current page
      : table.getSortedRowModel().rows; //all rows with filters and sorting, regardless of pagination

    const values = rows.map((row) => row.getValue(columnId));

    return (
      values.length === 0 ||
      values.every((v) => v === null || v === undefined || v === '')
    );
  };

  const getColumnsKeysNonEmpty = (
    activeColumns: string[],
    table: Table<ImageProduct>,
    pagination = true
  ) => {
    if (table)
      return activeColumns.filter(
        (colKey) => !isColumnOnlyEmpty(table, colKey, pagination)
      );
    return [];
  };

  useEffect(() => {
    console.log(data.find((d) => d.sku === 'C7571'));
  }, [data]);

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <DataPageLayout
          title="Images"
          loading={loading}
          totalResults={totalResults}
          actions={
            <PrimaryButton
              label="Export Excel"
              onClick={() => {
                if (table) {
                  setLoading(true);
                  //reapply all columns
                  const nonEmptyAssets = getColumnsKeysNonEmpty(
                    columns
                      .map((col) => col.key)
                      .filter((col) => col.startsWith('images')),
                    table,
                    false
                  );

                  const newVisibleColumns = [
                    ...visibleColumns.filter(
                      (col) => !col.startsWith('images')
                    ),
                    ...nonEmptyAssets,
                  ];
                  exportTableExcelManually(
                    table,
                    'products-images',
                    columns
                      .map((col) => col.key)
                      .filter((key) => newVisibleColumns.includes(key))
                  );

                  setLoading(false);
                }
              }}
            />
          }
        >
          <CustomDataTable data={data} useContext={useTableContext} />
        </DataPageLayout>
      )}
    </>
  );
};

Images.displayName = 'Images';

export default Images;
