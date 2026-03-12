import React, { useEffect, useState } from 'react';
import { usePaginationState } from '@commercetools-uikit/hooks';
import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  extractUniqueAttributes,
  mapProducts,
} from '../../utils/mappers/map-with-attributes';
import { exportToExcel } from '../../utils/export-excel';
import Filters, { FiltersProps } from '../../components/filters/filters';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { useProductsGraphql } from '../../hooks/use-products-connector/use-products-graphql';
import { TProduct } from '../../types/product';
import { COLUMN_ORDER } from './columns-order';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';

type Column = {
  key: string;
  label: string;
  isSortable?: boolean;
  renderItem?: (row) => React.ReactNode;
};

type OptionProps = { value: string; label: string };
type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;

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
  { key: 'edp', label: 'EDP' },
  { key: 'dop', label: 'DOP' },
  { key: 'datasheet', label: 'Datasheet' },
].map((col) => ({ ...col, isSortable: true })) as Column[];

const getNestedValue = (obj, key) => {
  return key.split('.').reduce((acc, k) => acc?.[k], obj);
};

const AllProducts = () => {
  const { getAllProducts, getAllProductTypes } = useProductsGraphql();

  const { page, perPage } = usePaginationState();

  //all raw products (and variants) fetched from ct
  const [allProducts, setAllProducts] = useState();

  //products shown in the page (with pagination)
  //will always be a slice of the mappedProducts
  const [products, setProducts] = useState<TProduct[]>([]);

  //final mapped data (allProducts mapped)
  const [mappedProducts, setMappedProducts] = useState([]);

  const [productTypes, setProductTypes] = useState();

  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumns, setActiveColumns] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const [sort, setSort] = useState<Sort>();

  //load the product types and the data
  useEffect(() => {
    const load = async () => {
      const productTypes = await getAllProductTypes();
      const allData = await getAllProducts();
      setProductTypes(productTypes);
      setAllProducts(allData);
    };
    load();
  }, []);

  //pagination handler
  /* useEffect(() => {
    const start = (page.value - 1) * perPage.value;
    const end = start + perPage.value;
    setProducts(mappedProducts.slice(start, end));
  }, [page.value, perPage.value, mappedProducts]); */

  //sorting handler
  useEffect(() => {
    if (!sort || !sort.key) return;
    const sorted = [...mappedProducts].sort((a, b) => {
      const valA = getNestedValue(a, sort.key);
      const valB = getNestedValue(b, sort.key);
      const compare = String(valA).localeCompare(String(valB)); // string sort

      return sort.dir === 'asc' ? compare : -compare;
    });
    page.onChange(1);
    setMappedProducts(sorted);
  }, [sort]);

  //map the data and add the attributes and the categories names
  useEffect(() => {
    if (!productTypes || productTypes.length === 0 || !products) return;

    //map the products
    const newProducts = mapProducts(allProducts, productTypes);
    setMappedProducts(newProducts);

    //products by default are all
    setProducts(newProducts);

    let { _, uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add the extra columns for the table (with the attributes)
    let newColumns = [...defaultColumns];
    uniqueAttributesComplete.forEach((attribute, index) => {
      newColumns.push({
        label: attribute.label,
        key: `attributes.${attribute.value}.value`,
        renderItem: (row) => <p>{row.attributes[attribute.value].value}</p>,
      });
    });

    //add sortable to the column
    newColumns = newColumns.map((col) => ({ ...col, isSortable: true }));

    //re-order the columns
    newColumns = setCorrectColumnOrder(newColumns);
    setColumns(newColumns);

    //set the default active columns
    const activeColumns = newColumns
      .filter((newCol) => {
        return defaultColumns.find((defCol) => defCol.key === newCol.key);
      })
      .map((col) => col.key);

    setActiveColumns(activeColumns);

    //set the options for the filters
    setFiltersConfig((prev) => [
      /* ...prev, */
      {
        filterKey: 'attributes',
        label: 'Attributes',
        options: uniqueAttributesComplete,
      },
    ]);

    setLoading(false);
  }, [productTypes, allProducts]);

  //when columns changed, change the applied filters
  const changedColumns = (newColumns: string[]) => {
    const newVisibleAttributesColumns = columns
      .filter(
        (col) =>
          newColumns.includes(col.key) && col.key.startsWith('attributes.') // Hide attribute columns when not selected in filters
      )
      .map((col) => ({ value: col.key, label: col.label }));

    setAppliedFilters((prev) => {
      if (newVisibleAttributesColumns.length === 0) {
        // If no attribute columns are visible, remove the attributes filter
        return prev.filter((f) => f.filterKey !== 'attributes');
      }

      const attributesFilterIndex = prev.findIndex(
        (f) => f.filterKey === 'attributes'
      );
      if (attributesFilterIndex === -1) {
        return [
          ...prev,
          { filterKey: 'attributes', values: newVisibleAttributesColumns },
        ];
      }

      prev[attributesFilterIndex].values = newVisibleAttributesColumns;
      return [...prev];
    });

    setActiveColumns(newColumns);
  };

  //when the filters change, replace the active columns
  const filtersChanged: SubmitCallbackProps = (key, selectedOptions) => {
    //remove all attributes from selected columns
    let newActiveColumns = activeColumns.filter(
      (col) => !col.startsWith('attributes.')
    );

    selectedOptions.forEach((filter) => {
      newActiveColumns.push(`attributes.${filter.value}.value`);
    });

    //reorder the active columns
    newActiveColumns = setCorrectActiveColumnOrder(newActiveColumns);
    setActiveColumns(newActiveColumns);
    setAppliedFilters((prev) => [
      ...prev.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ]);
  };

  const exportExcel = async () => {
    setLoading(true);

    //give only the visible columns
    const visibleColumns = activeColumns
      .map((colKey) => columns.find((col) => col.key === colKey))
      .filter(Boolean);

    console.log('to export: ', products);
    exportToExcel(products, visibleColumns, 'excel-export');
    setLoading(false);
  };

  //build the search query with "or" for all text fields (name, description, sku, ...)
  const buildSearchQuery = (searchTerm: string | undefined) => {
    if (!searchTerm) return undefined;

    const fields = [
      'name.en',
      'description.en',
      'masterVariant.sku',
      'variants.sku',
    ];

    const searchQuery = fields.map((field) => {
      const isComplex = field.split('.');

      if (isComplex.length > 1) {
        return `${isComplex[0]}(${isComplex[1]} = "${searchTerm}")`;
      }
      return `${field} = "${searchTerm}"`;
    });

    return `${searchQuery.join(' or ')}`;
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

  const setCorrectActiveColumnOrder = (columns: string[]) => {
    const orderIndex = new Map<string, number>(
      COLUMN_ORDER.map((key, index) => [key, index])
    );

    return [...columns].sort((a, b) => {
      const indexA = orderIndex.get(a) ?? Infinity;
      const indexB = orderIndex.get(b) ?? Infinity;
      return indexA - indexB;
    });
  };

  //callback when on column filters change
  const columnFilterChanged = (filters: ColumnFiltersState) => {
    let newData = [...mappedProducts];
    filters.forEach((filter) => {
      const id = filter.id;
      const values = filter.value;
      values.forEach((value) => {
        newData = newData.filter((prod) => getNestedValue(prod, id) === value);
      });
    });

    setProducts(newData);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <>
          <div className="flex gap-8">
            <PrimaryButton
              isDisabled={loading}
              label="Export Excel"
              onClick={() => exportExcel()}
            />
            <Filters
              appliedFilters={appliedFilters}
              filtersConfig={filtersConfig}
              submitCallback={filtersChanged}
            />
            {/* <SearchTextInput
            value={searchTerm ?? ""}
            onSubmit={(val) => setSearchTerm(val)}
            onReset={() => setSearchTerm(undefined)}
          /> */}
          </div>
          <TanstackTable
            data={mappedProducts}
            columns={columns}
            visibleColumns={activeColumns}
            onFilterChange={columnFilterChanged}
          />
        </>
      )}
    </>
  );
};

AllProducts.displayName = 'AllProducts';

export default AllProducts;
