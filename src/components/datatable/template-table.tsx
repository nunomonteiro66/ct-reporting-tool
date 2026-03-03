import Spacings from "@commercetools-uikit/spacings";
import DataTable from "@commercetools-uikit/data-table";
import DataTableManager, {
  TColumnProps,
  UPDATE_ACTIONS,
} from "@commercetools-uikit/data-table-manager";
import { Pagination } from "@commercetools-uikit/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingSpinner from "@commercetools-uikit/loading-spinner";
import { TState } from "@commercetools-uikit/hooks";

type TemplateTableProps = {
  data: any;
  columns: any;
  isLoading: boolean;
  page: TState;
  perPage: TState;
  totalItems: number;
  activeColumns: string[];
  columnsChangedCallback: any;
  onSortChange?: ({ key, dir }: Sort) => void;
};

export type Sort = {
  key?: string;
  dir: "asc" | "desc";
};

const TemplateTable = ({
  data,
  columns,
  isLoading,
  page,
  perPage,
  totalItems,
  activeColumns,
  columnsChangedCallback,
  onSortChange,
}: TemplateTableProps) => {
  const [sort, setSort] = useState<Sort>({
    dir: "asc",
  });

  const displaySettings = useMemo(
    () => ({
      disableDisplaySettings: false,
      isCondensed: false,
      isWrappingText: true,
    }),
    []
  );

  const columnsWithWidth = useMemo(
    () =>
      activeColumns.map((key) => ({
        ...columns.find((col) => col.key === key),
        width: "minmax(200px, 400px)",
      })),
    [columns, activeColumns]
  );

  const itemRenderer = useCallback((item, column) => {
    const getNestedValue = (obj, key) => {
      return key.split(".").reduce((acc, k) => acc?.[k], obj);
    };
    const value = getNestedValue(item, column.key);
    return <p>{value}</p>;
  }, []);

  const handleSettingsChange = useCallback(
    (action: string, nextValue: any) => {
      switch (action) {
        case UPDATE_ACTIONS.COLUMNS_UPDATE:
          //setActiveColumns(nextValue);
          columnsChangedCallback(nextValue);
          break;
        default:
          break;
      }
    },
    [columns]
  );

  const handleSortChange = useCallback(
    (key: string, dir: string) => {
      const newSort: Sort = {
        key: key,
        dir: "asc",
      };
      //second click, change direction to desc
      if (sort.key === key && sort.dir === "asc") {
        newSort.dir = "desc";
      }
      setSort(newSort);
      if (onSortChange) onSortChange(newSort);
    },
    [sort]
  );

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
              columns={columnsWithWidth}
              displaySettings={displaySettings}
              onSettingsChange={handleSettingsChange}
              columnManager={{
                visibleColumnKeys: activeColumns,
                hideableColumns: columns,
                areHiddenColumnsSearchable: false,
                disableColumnManager: false,

                /* onUpdateColumns: (nextVisibleColumns) => {
                  setColumns(nextVisibleColumns);
                }, */
              }}
              selectedColumns={[columns[0]]}
            >
              <DataTable<any>
                isCondensed
                rows={data}
                itemRenderer={itemRenderer}
                onSortChange={handleSortChange}
                sortDirection={sort.dir}
                sortedBy={sort.key}
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
