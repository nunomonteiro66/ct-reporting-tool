import { Button } from '@headlessui/react';
import TanstackTable from '../../components/tanstack-table/tanstack-table';
import { useRef, useState } from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import exportTableExcel from '../../components/tanstack-table/export-excel';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Test = () => {
  const [visible, setVisible] = useState([
    'id',
    'name',
    'attributes',
    'dimensions',
    'pricing',
    'inventory',
    'supplier',
    'dates',
    'status',
    'metadata',
  ]);

  const tableRef = useRef<Table<any> | null>(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Label' },

    {
      key: 'attributes',
      label: 'Attributes',
      children: [
        { key: 'drum', label: 'DRUM' },
        { key: 'drum2', label: 'DRUM2' },
        { key: 'color', label: 'Color' },
        { key: 'size', label: 'Size' },
        { key: 'weight', label: 'Weight' },
        { key: 'material', label: 'Material' },
      ],
    },

    {
      key: 'dimensions',
      label: 'Dimensions',
      children: [
        { key: 'length', label: 'Length' },
        { key: 'width', label: 'Width' },
        { key: 'height', label: 'Height' },
        { key: 'volume', label: 'Volume' },
      ],
    },

    {
      key: 'pricing',
      label: 'Pricing',
      children: [
        { key: 'price', label: 'Price' },
        { key: 'discount', label: 'Discount' },
        { key: 'tax', label: 'Tax' },
        { key: 'finalPrice', label: 'Final Price' },
      ],
    },

    {
      key: 'inventory',
      label: 'Inventory',
      children: [
        { key: 'stock', label: 'Stock' },
        { key: 'reserved', label: 'Reserved' },
        { key: 'available', label: 'Available' },
        { key: 'warehouse', label: 'Warehouse' },
      ],
    },

    {
      key: 'supplier',
      label: 'Supplier Info',
      children: [
        { key: 'supplierName', label: 'Name' },
        { key: 'supplierCode', label: 'Code' },
        { key: 'country', label: 'Country' },
        { key: 'contact', label: 'Contact' },
      ],
    },

    {
      key: 'dates',
      label: 'Dates',
      children: [
        { key: 'createdAt', label: 'Created At' },
        { key: 'updatedAt', label: 'Updated At' },
        { key: 'expiryDate', label: 'Expiry Date' },
      ],
    },

    {
      key: 'status',
      label: 'Status',
      children: [
        { key: 'active', label: 'Active' },
        { key: 'archived', label: 'Archived' },
        { key: 'visibility', label: 'Visibility' },
      ],
    },

    {
      key: 'metadata',
      label: 'Metadata',
      children: [
        { key: 'createdBy', label: 'Created By' },
        { key: 'updatedBy', label: 'Updated By' },
        { key: 'notes', label: 'Notes' },
      ],
    },
  ];

  const data = [{ key: 1, name: 'ASD', attributes: [{ drum: 'asd' }] }];

  const handleTableChange = () => {};

  const test = () => {
    const headerGroups = tableRef.current?.getHeaderGroups();
    // headerGroups[0] → first row (top-level groups)
    // headerGroups[1] → second row (sub-groups or leaf columns)
    // etc.

    headerGroups.forEach((headerGroup) => {
      headerGroup.headers.forEach((header) => {
        console.log(
          header.id,
          header.column.columnDef.header, // label
          header.colSpan, // how many columns it spans
          header.isPlaceholder, // true if it's a filler cell
          header.index,
          header.depth
        );
      });
    });
  };

  const exportingTest = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.addRow([null, null, 'attributes']);
    worksheet.mergeCells(1, 3, 1, 4);

    worksheet.addRow(['id', 'name', 'drum', 'drum1']);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      'asd'
    );
  };

  return (
    <>
      <Button onClick={test}>asdads</Button>
      <PrimaryButton
        label="Export Excel"
        onClick={() => {
          if (tableRef.current) {
            setTimeout(() => {
              exportTableExcel(tableRef.current);
            }, 0);
          }
        }}
      />
      <TanstackTable
        initialColumns={columns}
        data={data}
        visibleColumns={visible}
        setVisibleColumns={setVisible}
        setTable={(t) => {
          tableRef.current = t;
        }}
        onTableChange={handleTableChange}
      />
      <thead>
        {tableRef.current?.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan} // ← the span!
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
    </>
  );
};

export default Test;
