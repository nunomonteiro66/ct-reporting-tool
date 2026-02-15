import Spacings from "@commercetools-uikit/spacings";
import DataTable from "@commercetools-uikit/data-table";
import DataTableManager, {
  TColumnProps,
} from "@commercetools-uikit/data-table-manager";
import { Pagination } from "@commercetools-uikit/pagination";
import { useMemo } from "react";

type TemplateTableProps = {
  data: any;
  columns: any;
};

const TemplateTable = ({ data, columns }: TemplateTableProps) => {
  const displaySettings = {
    disableDisplaySettings: false,
    isCondensed: false,
    isWrappingText: true,
  };

  columns = columns.map((column: any) => ({
    width: "minmax(200px, 400px)",
    ...column,
  }));

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
          <DataTable<any>
            isCondensed
            rows={data}
            itemRenderer={(item, column) => {
              const getNestedValue = (obj, key) => {
                return key.split(".").reduce((acc, k) => acc?.[k], obj);
              };

              const value = getNestedValue(item, column.key);

              return <p>{value}</p>;
            }}
          />
        </DataTableManager>
      </div>
      {/* {totalItems > 0 && (
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={totalItems}
            perPageRange="m"
          />
        )} */}
    </Spacings.Stack>
  );
};

export default TemplateTable;
