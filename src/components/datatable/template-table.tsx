import Spacings from "@commercetools-uikit/spacings";
import DataTable from "@commercetools-uikit/data-table";
import DataTableManager, {
  TColumnProps,
} from "@commercetools-uikit/data-table-manager";
import { Pagination } from "@commercetools-uikit/pagination";
import { useMemo } from "react";
import LoadingSpinner from "@commercetools-uikit/loading-spinner";
import { TState } from "@commercetools-uikit/hooks";

type TemplateTableProps = {
  data: any;
  columns: any;
  isLoading: boolean;
  page: TState;
  perPage: TState;
  totalItems: number;
};

const TemplateTable = ({
  data,
  columns,
  isLoading,
  page,
  perPage,
  totalItems,
}: TemplateTableProps) => {
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
      {isLoading ? (
        <LoadingSpinner scale="l">Loading products</LoadingSpinner>
      ) : (
        <>
          <div
            style={{
              overflowX: "auto",
              width: "100%",
            }}
          >
            <DataTableManager
              columns={columns}
              displaySettings={displaySettings}
            >
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
        </>
      )}
    </Spacings.Stack>
  );
};

export default TemplateTable;
