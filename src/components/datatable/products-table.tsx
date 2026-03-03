import DataTable from "@commercetools-uikit/data-table";
import DataTableManager from "@commercetools-uikit/data-table-manager";
import { Pagination } from "@commercetools-uikit/pagination";
import LoadingSpinner from "@commercetools-uikit/loading-spinner";
import Spacings from "@commercetools-uikit/spacings";
import {
  usePaginationState,
  useDataTableSortingState,
  TState,
} from "@commercetools-uikit/hooks";
import { CTProductProjection } from "../../types/ct-product";
import { TProduct } from "../../types/product";
import PrimaryButton from "@commercetools-uikit/primary-button";
import { CSVLink, CSVDownload } from "react-csv";
const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"],
];

type TProductTableProps = {
  products: CTProductProjection[];
  loading: boolean;
  error?: Error | null;
  totalItems?: number;
  page: TState;
  perPage: TState;
};

const ProductsTable = ({
  products,
  loading,
  error,
  page,
  perPage,
  totalItems = 0,
}: TProductTableProps) => {
  const tableSorting = useDataTableSortingState({ key: "sku", order: "asc" });

  // Define columns
  let columns = [
    { key: "sku", label: "SKU", isSortable: true },
    { key: "product_name", label: "Product Name", isSortable: true },
    { key: "product_description", label: "Product Description" },
    { key: "product_category", label: "Product Categories" },
    { key: "product_type_key", label: "Product Type Key" },
    { key: "product_type_name", label: "Product Type Name" },
    { key: "type", label: "Type" },
    { key: "material", label: "Material of Conductor" },
    { key: "colour", label: "Colour of Sheath" },
    { key: "cross_section", label: "Cross-section [mm²]" },
    { key: "length_type", label: "Length Type" },
    { key: "specification", label: "Specification" },
    { key: "minimal_temperature", label: "Minimal Temperature" },
    { key: "ean", label: "EAN" },
    { key: "el", label: "EL" },
    { key: "length", label: "Length" },
    { key: "packaging", label: "Packaging" },
    { key: "application", label: "Application" },
    { key: "country_specific", label: "Country Specific" },
    { key: "customer_specific", label: "Customer Specific" },
    { key: "plants", label: "Plants" },
    { key: "sales_organizations", label: "Sales Organizations" },
    { key: "product_selection", label: "Product Selection" },
    { key: "image", label: "Image" },
    { key: "datasheet", label: "Datasheet" },
    { key: "dop_doc", label: "DOP/DOC" },
    { key: "epd", label: "EPD" },
  ];

  columns = columns.map((column) => ({
    width: "minmax(200px, 400px)",
    ...column,
  }));

  if (loading || !products) {
    return <LoadingSpinner>Searching products...</LoadingSpinner>;
  }

  if (error) {
    return <>errrror</>;
  }

  const displaySettings = {
    disableDisplaySettings: false,
    isCondensed: false,
    isWrappingText: true,
  };

  return (
    <Spacings.Stack scale="l">
      <div
        style={{
          overflowX: "auto",
          width: "100%",
          height: "90vh",
        }}
      >
        <DataTableManager columns={columns} displaySettings={displaySettings}>
          <DataTable<TProduct>
            isCondensed
            rows={products}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
          />
        </DataTableManager>
      </div>
      {totalItems > 0 && (
        <Pagination
          page={page.value}
          onPageChange={page.onChange}
          perPage={perPage.value}
          onPerPageChange={perPage.onChange}
          totalItems={totalItems}
          perPageRange="m"
        />
      )}
    </Spacings.Stack>
  );
};

ProductsTable.displayName = "ProductsTable";

export default ProductsTable;
