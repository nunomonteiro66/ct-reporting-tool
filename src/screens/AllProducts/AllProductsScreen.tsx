import { useEffect, useState } from 'react';
import {
  AttributeComplete,
  extractUniqueAttributes,
  mapProducts,
} from '../../utils/mappers/map-with-attributes';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { COLUMN_ORDER } from './columns-order';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import { DataManager } from './Data-manager';
import { Column } from '../../types/datatable-column';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';
import { MappedProduct } from '../../types/mapped-product';
import { TProduct } from '../../types/generated/ctp';
import { ProductType } from '../../types/product-type';

const defaultColumns = [
  { key: 'key', label: 'key' },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'masterData.current.name', label: 'Product Name' },
  { key: 'productType.key', label: 'Product Type Key' },
  { key: 'productType.name', label: 'Product Type Name' },
  { key: 'masterData.current.description', label: 'Description' },
  { key: 'categories', label: 'Categories' },
  { key: 'selections', label: 'Product Selections' },
  { key: 'image', label: 'Image' },
  { key: 'epd', label: 'EPD' },
  { key: 'dop', label: 'DOP' },
  { key: 'datasheet', label: 'Datasheet' },
].map((col) => ({ ...col, isSortable: true })) as Column[];

const AllProducts = () => {
  const { getAllProducts, getAllProductTypes } = useProductsGraphql();
  const { getAllLanguagesCodes } = useProjectGraphql();

  const [rawData, setRawData] = useState<TProduct[]>();
  const [productTypes, setProductTypes] = useState<ProductType[]>();

  //products shown in the page (with filters)
  //will always be a slice of the allProducts
  const [products, setProducts] = useState<MappedProduct[]>([]);

  const [columns, setColumns] = useState<Column[]>([]);

  const [loading, setLoading] = useState(true);

  const [uniqueAttributes, setUniqueAttributes] = useState<AttributeComplete[]>(
    []
  );

  //language codes (pt, en, ...)
  //defines the language of the attributes values
  const [languages, setLanguages] = useState<string[]>([]);

  //fetch the product types, the data and the languages codes
  useEffect(() => {
    const load = async () => {
      const productTypes = await getAllProductTypes();
      const rawData = await getAllProducts();
      const languages = await getAllLanguagesCodes();

      setRawData(rawData);
      setProductTypes(productTypes);
      setLanguages(languages);
      getAllUniqueAttributes(productTypes);
    };
    load();
  }, []);

  //maps the raw data into usable data (mapped data)
  //triggers when the language changes
  useEffect(() => {
    if (!productTypes || !rawData || !languages) return;

    //map the products
    const newProducts = mapProducts(rawData, productTypes, languages);
    setProducts(newProducts);

    setLoading(false);
  }, [languages]);

  const getAllUniqueAttributes = (productTypes: any) => {
    if (!productTypes || productTypes.length === 0) return;
    let { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add keys to the attributes labels
    uniqueAttributesComplete = uniqueAttributesComplete.map((attr) => ({
      ...attr,
      label: [
        ...(Array.isArray(attr.label) ? attr.label : [attr.label]),
        `(${attr.value})`,
      ],
    }));

    setUniqueAttributes(uniqueAttributesComplete);

    //add the extra columns for the table (with the attributes)
    let newColumns = [...defaultColumns];
    uniqueAttributesComplete.forEach((attribute, index) => {
      newColumns.push({
        label: attribute.label,
        key: `attributes.${attribute.value}.value`,
        isVisible: false, //hidden by default
        isSortable: true,
      });
    });

    //re-order the columns
    newColumns = setCorrectColumnOrder(newColumns);
    setColumns(newColumns);
  };

  //sets the order of the columns the same as the columnsOrder
  const setCorrectColumnOrder = (columns: Column[]) => {
    const orderIndex = new Map<string, number>(
      COLUMN_ORDER.map((key, index) => [key, index])
    );

    return [...columns].sort((a, b) => {
      const indexA = orderIndex.get(a.key) ?? Infinity;
      const indexB = orderIndex.get(b.key) ?? Infinity;
      return indexA - indexB;
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <>
          <DataManager
            data={products}
            columns={columns}
            uniqueAttributes={uniqueAttributes}
            languages={languages}
            setLanguages={setLanguages}
          />
        </>
      )}
    </>
  );
};

AllProducts.displayName = 'AllProducts';

export default AllProducts;
