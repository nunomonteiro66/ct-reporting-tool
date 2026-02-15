import { useEffect, useMemo, useState } from "react";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";
import { useProductsAPI } from "../../hooks/use-products-connector";
import { usePaginationState } from "@commercetools-uikit/hooks";
import TemplateTable from "../datatable/template-table";
import { TProduct } from "../../types/product";
import { TProductProjection } from "../../types/generated/ctp";
import PrimaryButton from "@commercetools-uikit/primary-button";
import { CSVDownload } from "react-csv";
import { extractUniqueAttributes, mapProducts } from "../../utils/export-csv";

const ExportCSV = ({ allProducts }: any) => {
  /* const { uniqueAttributes, loading } = useGetProductTypes();

  if (loading) return <>Loading</>;

  const finalComposeKeys = extractComposeKeys(allProducts[0]);
  console.log("FINALL KEYS: ", finalComposeKeys);

  return <></>; */
};

const columns = [
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
  const { fetchAllProducts, loading, error } = useProductsAPI();
  const [mappedProducts, setMappedProducts] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        //get all products
        const results = await fetchAllProducts({
          limit: 5,
          offset: 0,
          expand: ["productType"],
        });

        //map the products
        const newProducts = mapProducts(results?.results, productTypes);
        setMappedProducts(newProducts);

        console.log("MAPPED PRODUCTS: ", newProducts);
        const { _, uniqueAttributesComplete } =
          extractUniqueAttributes(productTypes);

        //add the extra columns for the table (with the attributes)
        uniqueAttributesComplete.forEach((attribute, index) => {
          columns.push({
            label: attribute.label,
            key: `attributes.${attribute.value}.value`,
            renderItem: (row) => <p>{row.attributes[attribute.value].value}</p>,
          });
        });
        console.log("COLUMNS: ", columns);
      } catch (err) {
        //setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };
    loadAllProducts();
  }, [page.value, perPage.value, productTypes]);

  return (
    <>
      <PrimaryButton
        label="Export CSV"
        onClick={() => setExporting(true)}
      ></PrimaryButton>
      {exporting ? (
        <CSVDownload data={mappedProducts} headers={columns} target="_blank" />
      ) : (
        <TemplateTable data={mappedProducts} columns={columns} />
      )}
    </>
  );
};

AllProducts.displayName = "AllProducts";

export default AllProducts;
