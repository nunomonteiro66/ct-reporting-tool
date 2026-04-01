import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Table } from '@tanstack/react-table';

const sanitize = (value: unknown) => {
  if (value === '' || value === undefined || value === null) return null;
  if (Array.isArray(value))
    return value.length === 1 ? String(value[0]) : value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
};

const exportTableExcel = async <T,>(
  table: Table<T>,
  fileName = 'data.xlsx'
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const headerGroups = table.getHeaderGroups();

  // Add header rows
  headerGroups.forEach((group, rowIndex) => {
    const visibleHeaders = group.headers.filter(
      (h) => h.column.getIsVisible() || h.subHeaders.length > 0
    );

    worksheet.addRow(
      visibleHeaders.map((h) => {
        if (h.isPlaceholder) return null;
        const header = h.column.columnDef.header;
        return Array.isArray(header) ? header.join(' ') : (header as string);
      })
    );

    // Style + merge group headers
    let colIndex = 1;
    visibleHeaders.forEach((h) => {
      if (h.colSpan > 1) {
        worksheet.mergeCells(
          rowIndex + 1,
          colIndex,
          rowIndex + 1,
          colIndex + h.colSpan - 1
        );
      }
      colIndex += h.colSpan;
    });

    // Style header row
    const row = worksheet.getRow(rowIndex + 1);
    row.font = { bold: true };
    row.alignment = { horizontal: 'center' };
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
    });
  });

  // Set column widths based on leaf columns
  const leafHeaders = headerGroups
    .at(-1)!
    .headers.filter((h) => h.column.getIsVisible());

  leafHeaders.forEach((h, i) => {
    worksheet.getColumn(i + 1).width = 25;
  });

  // Add data rows
  table.getCoreRowModel().rows.forEach((row) => {
    worksheet.addRow(
      leafHeaders.map((h) => {
        const cell = row.getAllCells().find((c) => c.column.id === h.column.id);
        return sanitize(cell?.getValue());
      })
    );
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    fileName
  );
};

export default exportTableExcel;
