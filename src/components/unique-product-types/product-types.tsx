import { useEffect, useMemo } from "react";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";
import TemplateTable from "../datatable/template-table";

const ProductTypes = () => {
  const { uniqueAttributes, loading } = useGetProductTypes();

  const columns = [
    {
      key: "label",
      label: "label",
    },
    {
      key: "value",
      label: "key",
    },
  ];

  if (loading) return <>LOADING</>;

  return <TemplateTable data={uniqueAttributes} columns={columns} />;
};

ProductTypes.displayName = "ProductTypes";

export default ProductTypes;
