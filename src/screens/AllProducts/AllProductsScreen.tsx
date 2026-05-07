import { useEffect, useState } from 'react';
import {
  extractUniqueAttributes,
  mapProducts,
  mapProductsParallel,
} from '../../utils/mappers/map-with-attributes';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import { Column } from '../../types/datatable-column';
import { useProjectGraphql } from '../../hooks/use-project-connector/use-project-graphql';
import { MappedProduct } from '../../types/mapped-product';
import { TProduct } from '../../types/generated/ctp';
import { ProductType } from '../../types/product-type';
import { AttributeComplete } from '../../types/attribute';
import { useCategoriesGraphql } from '../../hooks/use-categories-connector/use-categories-graphql';
import { Category } from '../../types/category';
import { useTableContext } from './context';
import PrimaryButton from '@commercetools-uikit/primary-button';
import DataPageLayout from '../../layouts/data-page-layout';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import Filters from './Filters';
import CustomDataTable from '../../components/tanstack-table/custom-data-table';
import { orderColumnsByKeys } from '../../utils/sorting';
import { COLUMN_ORDER } from './columns-order';

const defaultColumns = [
  { key: 'key', label: 'key' },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'productType.key', label: 'Product Type Key' },
  { key: 'productType.name', label: 'Product Type Name' },
  { key: 'categories', label: 'Categories', disableFilter: true },
  { key: 'selections', label: 'Product Selections' },
  { key: 'image', label: 'Image' },
  { key: 'epd', label: 'EPD' },
  { key: 'dop', label: 'DOP' },
  { key: 'doc', label: 'DOC' },
  { key: 'datasheet', label: 'Datasheet' },
].map((col) => ({ ...col, isSortable: true })) as Column[];

const AllProducts = () => {
  const {
    state: { loading, table, totalResults },
    actions: { setColumns, setLoading, setVisibleColumns, setColumnOrder },
  } = useTableContext();

  const { getAllProducts, getAllProductTypes, getProducts } =
    useProductsGraphql();
  const { getAllLanguagesCodes } = useProjectGraphql();
  const { getAllCategories } = useCategoriesGraphql();

  const [rawData, setRawData] = useState<TProduct[]>();
  const [productTypes, setProductTypes] = useState<ProductType[]>();
  const [categories, setCategories] = useState<Category[]>();

  //products shown in the page (with filters)
  //will always be a slice of the allProducts
  const [products, setProducts] = useState<MappedProduct[]>([]);

  const [uniqueAttributes, setUniqueAttributes] = useState<AttributeComplete[]>(
    []
  );

  //language codes (pt, en, ...)
  //defines the language of the attributes values
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, []);

  //maps the raw data into usable data (mapped data)
  //triggers when the language changes
  useEffect(() => {
    if (!productTypes || !rawData || !languages) return;

    const mapRemainingProducts = async () => {
      const newProducts = await mapProductsParallel(
        rawData.slice(20),
        productTypes,
        languages
      );
      setProducts((prev) => [...prev, ...newProducts]);
    };

    //map the products
    const mappedProducts = mapProducts(
      rawData.slice(0, 20),
      productTypes,
      languages
    );
    setProducts(mappedProducts);

    mapRemainingProducts();

    setLoading(false);
  }, [languages]);

  //fetch the product types, the data and the languages codes
  //build the columns and map all the data
  const loadData = async () => {
    const [productTypes, rawData, languages, rawCategories] = await Promise.all(
      [
        getAllProductTypes(),
        getAllProducts(),
        /* (
          await getProducts(0, 20)
        ).data.results, */
        getAllLanguagesCodes(),
        getAllCategories(),
      ]
    );

    //get the categories and map the facet keys (assigned attributes)
    const categories = rawCategories.map((category) => ({
      ...category,
      facetAttributeKeys: category.custom?.customFieldsRaw
        ? String(category.custom?.customFieldsRaw[0].value).split(':')
        : undefined,
      name: `${category.parent?.name} > ${category.name}`,
    })) as Category[];

    setRawData(rawData);
    setProductTypes(productTypes);
    setLanguages(languages);
    setCategories(categories);

    console.log('CATEGOIRES: ', categories);

    const uniqueAttrs = getAllUniqueAttributes(productTypes);
    setUniqueAttributes(uniqueAttrs);

    const finalCols = buildColumns(uniqueAttrs, languages);
    setColumns(finalCols);

    //set default visible columns (parents only)
    setVisibleColumns(
      finalCols.filter((col) => col.isVisible !== false).map((col) => col.key)
    );

    //set default column order
    setColumnOrder(
      orderColumnsByKeys(finalCols, COLUMN_ORDER).map((col) => col.key)
    );
  };

  const getAllUniqueAttributes = (productTypes: any) => {
    if (!productTypes || productTypes.length === 0) return [];
    let { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add keys to the attributes labels, and all localized labels
    uniqueAttributesComplete = uniqueAttributesComplete.map((attr) => ({
      ...attr,
      label: [
        ...(Array.isArray(attr.label) ? attr.label : [attr.label]),
        `${attr.value}`,
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
    const attrColumns = uniqueAttributesComplete.map((attribute) => {
      //attribute has several values (localization)
      //0000_branch_code (EL) is the only exception to the localization
      if (attribute.type === 'ltext' && attribute.value != '0000_branch_code') {
        const getLabel = (lang: string) =>
          attribute.label_locales.find((labell) => labell.locale === lang)
            ?.value;

        //the default label
        const enLabel = getLabel('en') ?? '';
        return {
          label: `${attribute.value}`,
          key: `attributes.${attribute.value}`,
          isVisible: false,
          children: languages.map((lang) => {
            const labelTranslated = getLabel(lang) ?? enLabel;
            return {
              label: `${labelTranslated} (${lang})`,
              key: lang,
            };
          }),
        };
      }

      return {
        label: attribute.label[1], //attribute id
        isVisible: false,
        key: `attributes.${attribute.value}`,
        children: [
          {
            label: attribute.label[0], //attribute name (en)
            key: 'en',
          },
        ],
      };
    });

    const newColumns = [...defaultColumns, ...attrColumns];

    //add all the extra columns for the locales (names, descriptions)
    const extraColumns = [
      {
        key: 'names',
        label: 'Product Name',
      },
      {
        key: 'descriptions',
        label: 'Descriptions',
      },
    ];

    extraColumns.forEach((col) =>
      newColumns.push({
        key: col.key,
        label: col.label,
        children: languages.map((lang) => ({
          key: lang,
          label: `${col.label} (${lang.toUpperCase()})`,
        })),
      })
    );

    return newColumns;
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <>
          <DataPageLayout
            title="Products"
            loading={loading}
            totalResults={totalResults}
            actions={
              <>
                <PrimaryButton
                  label="Export Excel"
                  onClick={() => {
                    console.log('TABLE: ', table);
                    if (table) {
                      setLoading(true);

                      setTimeout(() => {}, 6000);

                      exportTableExcel(table, 'products-w-attributes');
                      setLoading(false);
                    }
                  }}
                />
              </>
            }
          >
            <Filters
              categories={categories ?? []}
              languages={languages}
              uniqueAttributes={uniqueAttributes}
            />

            <CustomDataTable
              data={products}
              pinnedColumns={['key', 'sku', 'names']}
              useContext={useTableContext}
              categories={categories}
            />
          </DataPageLayout>
        </>
      )}
    </>
  );
};

AllProducts.displayName = 'AllProducts';

export default AllProducts;
