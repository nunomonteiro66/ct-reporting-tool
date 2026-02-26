import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";
import { useProductsAPI } from "../../hooks/use-products-connector";
import { usePaginationState } from "@commercetools-uikit/hooks";
import TemplateTable from "../../components/datatable/template-table";
import PrimaryButton from "@commercetools-uikit/primary-button";
import DropdownMenu from "@commercetools-uikit/dropdown-menu";
import SecondaryButton from "@commercetools-uikit/secondary-button";
import CheckboxInput from "@commercetools-uikit/checkbox-input";
import { FilterIcon } from "@commercetools-uikit/icons";
import { CSVDownload } from "react-csv";
import {
  extractUniqueAttributes,
  mapProducts,
} from "../../utils/mappers/map-with-attributes";
import { exportToExcel } from "../../utils/export-excel";
import Filters, { FiltersProps } from "../../components/filters/filters";
import { TAppliedFilter } from "@commercetools-uikit/filters";
import { TAppliedFilterValue } from "@commercetools-uikit/filters/dist/declarations/src/filter-menu";

type Column = {
  key: string;
  label: string;
  renderItem?: (row) => React.ReactNode;
};

type OptionProps = { value: string; label: string };
type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;

const defaultColumns = [
  { key: "key", label: "key" },
  {
    key: "sku",
    label: "SKU",
  },
  { key: "name.en", label: "Product Name" },
  { key: "productType.obj.key", label: "Product Type Key" },
  { key: "productType.typeId", label: "Product Type Id" },
  { key: "description.en", label: "Description" },
] as Column[];

const MemoTable = React.memo(TemplateTable);

const AllProducts = () => {
  const { page, perPage } = usePaginationState();
  const { productTypes } = useGetProductTypes();
  const { fetchProducts, fetchAllProducts, fetchAllProductsParalel } =
    useProductsAPI();
  const [products, setProducts] = useState();
  const [mappedProducts, setMappedProducts] = useState([]);
  const [exporting, setExporting] = useState(false);

  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumns, setActiveColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );

  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  //filters states
  const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);

  const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);

  //fetch the data from the api
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true);
        //get all products
        const results = await fetchProducts({
          limit: perPage.value,
          page: page.value,
          expand: ["productType"],
        });

        setTotalItems(results?.total);
        setProducts(results?.results);
      } catch (err) {
        //setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };
    loadAllProducts();
  }, [page.value, perPage.value]);

  //map the data and add the attributes
  useEffect(() => {
    if (!productTypes || productTypes.length === 0 || !products) return;

    //map the products
    const newProducts = mapProducts(products, productTypes);
    setMappedProducts(newProducts);

    let { _, uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

    //add the extra columns for the table (with the attributes)
    const newColumns = [...defaultColumns];
    uniqueAttributesComplete.forEach((attribute, index) => {
      newColumns.push({
        label: attribute.label,
        key: `attributes.${attribute.value}.value`,
        renderItem: (row) => <p>{row.attributes[attribute.value].value}</p>,
      });
    });

    //add extra column for the "Image" (if variant has any image)
    newColumns.push({
      label: "Image",
      key: "image",
    });

    //add extra columns for the assets
    const assetsColumns = [
      {
        label: "EPD",
        key: "epd",
      },
      {
        label: "DOP/DOC",
        key: "dop",
      },
      {
        label: "Datasheet",
        key: "datasheet",
      },
    ];
    newColumns.push(...assetsColumns);

    setColumns((prev) => [...defaultColumns, ...newColumns]);

    //set the options for the filters
    setFiltersConfig((prev) => [
      /* ...prev, */
      {
        filterKey: "attributes",
        label: "Attributes",
        options: uniqueAttributesComplete,
      },
    ]);

    setLoading(false);
  }, [productTypes, products]);

  //when columns changed, change the applied filters
  const changedColumns = (newColumns: string[]) => {
    const newVisibleAttributesColumns = columns
      .filter(
        (col) =>
          newColumns.includes(col.key) && col.key.startsWith("attributes.") // Hide attribute columns when not selected in filters
      )
      .map((col) => ({ value: col.key, label: col.label }));

    setAppliedFilters((prev) => {
      if (newVisibleAttributesColumns.length === 0) {
        // If no attribute columns are visible, remove the attributes filter
        return prev.filter((f) => f.filterKey !== "attributes");
      }

      const attributesFilterIndex = prev.findIndex(
        (f) => f.filterKey === "attributes"
      );
      if (attributesFilterIndex === -1) {
        return [
          ...prev,
          { filterKey: "attributes", values: newVisibleAttributesColumns },
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
    const newActiveColumns = activeColumns.filter(
      (col) => !col.startsWith("attributes.")
    );

    selectedOptions.forEach((filter) => {
      newActiveColumns.push(`attributes.${filter.value}.value`);
    });

    setActiveColumns(newActiveColumns);
    setAppliedFilters((prev) => [
      ...prev.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ]);
  };

  const exportExcel = async () => {
    setLoading(true);
    //const results = await fetchAllProducts({ expand: ["productType"] });

    let results = await fetchAllProductsParalel({ expand: ["productType"] });

    const mappedProducts = mapProducts(results, productTypes);

    //give only the visible columns
    const visibleColumns = activeColumns
      .map((colKey) => columns.find((col) => col.key === colKey))
      .filter(Boolean);

    exportToExcel(mappedProducts, visibleColumns, "excel-export");
    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-8">
        <PrimaryButton
          isDisabled={loading}
          label="Export Excel"
          onClick={() => exportExcel()}
        ></PrimaryButton>
        <Filters
          appliedFilters={appliedFilters}
          filtersConfig={filtersConfig}
          submitCallback={filtersChanged}
        />
      </div>

      <MemoTable
        data={mappedProducts}
        columns={columns}
        isLoading={loading}
        page={page}
        perPage={perPage}
        totalItems={totalItems}
        activeColumns={activeColumns}
        columnsChangedCallback={changedColumns}
      />
    </>
  );
};

AllProducts.displayName = "AllProducts";

export default AllProducts;
