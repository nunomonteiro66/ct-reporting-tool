import { useEffect, useState } from 'react';
import {
  AttributeComplete,
  extractUniqueAttributes,
  mapProducts,
} from '../../utils/mappers/map-with-attributes';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct } from '../../types/product';
import { COLUMN_ORDER } from './columns-order';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import { ProductType } from '../../types/product-type';
import { DataManager } from './Data-manager';
import { Column } from '../../types/datatable-column';
import { TProduct as CTProduct } from '../../types/generated/ctp';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';

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

  //all raw products (and variants) fetched from ct
  const [allProducts, setAllProducts] = useState<CTProduct[]>();

  //products shown in the page (with pagination)
  //will always be a slice of the mappedProducts
  const [products, setProducts] = useState<TProduct[]>([]);

  const [productTypes, setProductTypes] = useState<ProductType[]>();

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
      const allData = await getAllProducts();
      const languages = await getAllLanguagesCodes();
      setProductTypes(productTypes);
      setAllProducts(allData);
      setLanguages(languages);
    };
    load();
  }, []);

  //map the data and add the attributes and the categories names
  useEffect(() => {
    if (
      !productTypes ||
      productTypes.length === 0 ||
      !allProducts ||
      !languages
    )
      return;

    //map the products
    const newProducts = mapProducts(allProducts, productTypes, languages);

    //products are all by default
    setProducts(newProducts);

    setLoading(false);
  }, [productTypes, allProducts, languages]);

  //get all unique attributes (for filters and columns)
  useEffect(() => {
    if (!productTypes || productTypes.length === 0) return;
    let { _, uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add keys to the attributes labels
    uniqueAttributesComplete = uniqueAttributesComplete.map((attr) => ({
      ...attr,
      label: [attr.label, `(${attr.value})`],
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
  }, [productTypes]);

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
