import { useEffect, useState } from "react";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";
import { useProductsAPI } from "../../hooks/use-products-connector";
import { usePaginationState } from "@commercetools-uikit/hooks";
import TemplateTable from "../datatable/template-table";
import PrimaryButton from "@commercetools-uikit/primary-button";
import { CSVDownload } from "react-csv";
import {
  extractUniqueAttributes,
  mapProducts,
} from "../../utils/map-with-attributes";
import { exportToExcel } from "../../utils/export-excel";

const defaultColums = [
  { key: "key", label: "key" },
  {
    key: "sku",
    label: "SKU",
    isSortable: true,
  },
  { key: "name.en", label: "Product Name", isSortable: true },
  { key: "productType.obj.key", label: "Product Type Key" },
  { key: "productType.typeId", label: "Product Type Id" },
  { key: "description.en", label: "Description" },
  { key: "metaDescription.en", label: "Meta Description" },
  { key: "metaTitle.en", label: "Meta Title" },
];

const AllProducts = () => {
  const { page, perPage } = usePaginationState();
  const { productTypes } = useGetProductTypes();
  const { fetchProducts, fetchAllProducts, fetchAllProductsParalel } =
    useProductsAPI();
  const [products, setProducts] = useState();
  const [mappedProducts, setMappedProducts] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [columns, setColumns] = useState(defaultColums);
  const [exportToCsv, setExportToCsv] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

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

    const { _, uniqueAttributesComplete } =
      extractUniqueAttributes(productTypes);

    //add the extra columns for the table (with the attributes)
    const newColumns = [...defaultColums];
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

    setColumns(newColumns);
    setLoading(false);
  }, [productTypes, products]);

  const exportExcel = async () => {
    setLoading(true);
    //const results = await fetchAllProducts({ expand: ["productType"] });

    let results = await fetchAllProductsParalel({ expand: ["productType"] });

    const mappedProducts = mapProducts(results, productTypes);
    exportToExcel(mappedProducts, columns, "excel-export");
    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-8">
        <PrimaryButton
          isDisabled={loading}
          label="Export Excel"
          onClick={() => exportExcel()}
          //onClick={() => exportToExcel(mappedProducts, columns)}
        ></PrimaryButton>

        <PrimaryButton
          isDisabled={loading}
          label="Export CSV"
          //onClick={() => setExporting(true)}
          onClick={() => {
            setLoading(true);
            setExportToCsv(true);
          }}
        ></PrimaryButton>
      </div>

      <TemplateTable
        data={mappedProducts}
        columns={columns}
        isLoading={loading}
        page={page}
        perPage={perPage}
        totalItems={totalItems}
      />

      {exportToCsv && !loading && (
        <CSVDownload data={mappedProducts} headers={columns} target="_blank" />
      )}
    </>
  );
};

AllProducts.displayName = "AllProducts";

export default AllProducts;
