import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";
import TemplateTable from "../datatable/template-table";
import DataTableManager, {
  UPDATE_ACTIONS,
} from "@commercetools-uikit/data-table-manager";
import DataTable from "@commercetools-uikit/data-table";
import FlatButton from "@commercetools-uikit/flat-button";

const MemoTable = React.memo(TemplateTable);

const ProductTypes = () => {
  const columnsDef = [
    { key: "key", label: "Key" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },

    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "zipCode", label: "Zip Code" },
    { key: "company", label: "Company" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    { key: "deletedAt", label: "Deleted At" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "createdBy", label: "Created By" },
    { key: "updatedBy", label: "Updated By" },
    { key: "approvedBy", label: "Approved By" },
    { key: "amount", label: "Amount" },
    { key: "price", label: "Price" },
    { key: "quantity", label: "Quantity" },
    { key: "total", label: "Total" },
    { key: "discount", label: "Discount" },
    { key: "tax", label: "Tax" },
    { key: "currency", label: "Currency" },
    { key: "reference", label: "Reference" },
    { key: "notes", label: "Notes" },
    { key: "comments", label: "Comments" },
    { key: "attachments", label: "Attachments" },
    { key: "version", label: "Version" },
    { key: "isActive", label: "Is Active" },
    { key: "isArchived", label: "Is Archived" },
    { key: "lastLogin", label: "Last Login" },
    { key: "rating", label: "Rating" },
  ];

  const columns = useMemo(() => columnsDef, []);

  const [active, setActive] = useState(["key"]);

  const data = [
    { name: "Shirt", key: "shirt", description: "A shirt product type" },
    { name: "Pants", key: "pants", description: "A pants product type" },
    { name: "Shoes", key: "shoes", description: "A shoes product type" },
  ];

  const handleSettingsChange = useCallback(
    (action: string, nextValue: any) => {
      switch (action) {
        case UPDATE_ACTIONS.COLUMNS_UPDATE:
          setActive(nextValue);
          break;
        case UPDATE_ACTIONS.IS_TABLE_CONDENSED_UPDATE:
          break;
        case UPDATE_ACTIONS.IS_TABLE_WRAPPING_TEXT_UPDATE:
          break;
        default:
          break;
      }
    },
    [setActive]
  );

  const getCurrentColumns = useMemo(
    () =>
      active.map((key) => ({
        ...columns.find((col) => col.key === key),
        width: "minmax(200px, 400px)",
      })),
    [active, columns]
  );

  useEffect(() => {
    const more = [];
    for (let i = 0; i < 700; i++) {
      more.push({
        key: `Product ${i}`,
        label: `product-${i}`,
        description: `Description for product ${i}`,
      });
    }
    columns.push(...more);
  }, []);

  return (
    <div
      style={{
        overflowX: "auto",
        width: "100%",
        height: "4000px",
      }}
    >
      <MemoTable
        data={data}
        columns={columns}
        isLoading={false}
        page={{ value: 1, onChange: () => {} }}
        perPage={{ value: 10, onChange: () => {} }}
        totalItems={data.length}
        activeColumns={active}
        setActiveColumns={setActive}
      />
    </div>
  );

  return (
    <DataTableManager
      columns={getCurrentColumns}
      onSettingsChange={handleSettingsChange}
      displaySettings={{
        disableDisplaySettings: false,
      }}
      columnManager={{
        disableColumnManager: false,
        areHiddenColumnsSearchable: true,
        visibleColumnKeys: active,
        hideableColumns: columns,
      }}
    >
      <DataTable<any> rows={data} />
    </DataTableManager>
  );
};

ProductTypes.displayName = "ProductTypes";

export default ProductTypes;
