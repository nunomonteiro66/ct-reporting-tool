import { useEffect, useState } from 'react';
import {
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
import { AttributeComplete } from '../../types/attribute';

const defaultColumns = [
  { key: 'key', label: 'key' },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'productType.key', label: 'Product Type Key' },
  { key: 'productType.name', label: 'Product Type Name' },
  { key: 'categories', label: 'Categories' },
  { key: 'selections', label: 'Product Selections' },
  { key: 'image', label: 'Image' },
  { key: 'epd', label: 'EPD' },
  { key: 'dop', label: 'DOP' },
  { key: 'doc', label: 'DOC' },
  { key: 'datasheet', label: 'Datasheet' },
].map((col) => ({ ...col, isSortable: true })) as Column[];

const AllProducts = () => {
  const { getAllProducts, getAllProductTypes, getProducts } =
    useProductsGraphql();
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
      //const rawData = (await getProducts(0, 1)).data.results;
      const languages = await getAllLanguagesCodes();
      setRawData(rawData);
      setProductTypes(productTypes);
      setLanguages(languages);

      const uniqueAttrs = getAllUniqueAttributes(productTypes);
      setUniqueAttributes(uniqueAttrs);

      const finalCols = buildColumns(uniqueAttrs, languages);
      setColumns(finalCols);
    };
    load();
  }, []);

  //maps the raw data into usable data (mapped data)
  //triggers when the language changes
  useEffect(() => {
    if (!productTypes || !rawData || !languages) return;

    //map the products
    const newProducts = mapProducts(rawData, productTypes);
    setProducts(newProducts);

    setLoading(false);
  }, [languages]);

  const getAllUniqueAttributes = (productTypes: any) => {
    if (!productTypes || productTypes.length === 0) return [];
    let { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add keys to the attributes labels, and all localized labels
    uniqueAttributesComplete = uniqueAttributesComplete.map((attr) => ({
      ...attr,
      label: [
        ...(Array.isArray(attr.label) ? attr.label : [attr.label]),
        `(${attr.value})`,
      ],
    }));
    return uniqueAttributesComplete;
  };

  //builds the final columns with all the extra fields
  const buildColumns = (
    uniqueAttributesComplete: AttributeComplete[],
    languages: string[]
  ) => {
    //add the extra columns for the attributes
    let newColumns = [...defaultColumns];
    uniqueAttributesComplete.forEach((attribute, index) => {
      let newColEntry = {
        label: Array.isArray(attribute.label)
          ? attribute.label.join(' ')
          : attribute.label,
        key: `attributes.${attribute.value}`,
        isVisible: false, //hidden by default
      };
      //attribute has several values (localization)
      //0000_branch_code (EL) is the only exception to the localization
      if (attribute.type === 'ltext' && attribute.value != '0000_branch_code') {
        const getLabel = (lang: string) =>
          attribute.label_locales.find((labell) => labell.locale === lang)
            ?.value;

        //the default label
        const enLabel = getLabel('en') ?? '';
        languages.forEach((lang) => {
          const labelTranslated = getLabel(lang) ?? enLabel;

          newColumns.push({
            label: `${labelTranslated} (${attribute.value}) (${lang})`,
            key: `attributes.${attribute.value}.${lang}`,
            isVisible: false,
          });
        });
      } else
        newColumns.push({
          ...newColEntry,
          isSortable: true,
        });
    });

    //add all the extra columns for the locales (names, descriptions)
    languages.forEach((lang) => {
      newColumns.push({
        key: `names.${lang}`,
        label: `Product Name (${lang})`,
      });

      newColumns.push({
        key: `descriptions.${lang}`,
        label: `Description (${lang})`,
      });
    });

    //re-order the columns
    newColumns = setCorrectColumnOrder(newColumns);
    return newColumns;
  };

  //sets the order of the columns the same as the columnsOrder
  const setCorrectColumnOrder = (columns: Column[]) => {
    const orderIndex = new Map<string, number>(
      COLUMN_ORDER.map((key, index) => [key, index])
    );

    const getOrderIndex = (key: string) => {
      if (!key) return;

      const index = orderIndex.get(key);
      if (index === undefined) {
        const keyArray = key.split('.');
        keyArray.pop();
        const newKey = keyArray.join('.');

        return getOrderIndex(newKey);
      }
      return index;
    };

    return [...columns].sort((a, b) => {
      const indexA = getOrderIndex(a.key) ?? Infinity;
      const indexB = getOrderIndex(b.key) ?? Infinity;
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
