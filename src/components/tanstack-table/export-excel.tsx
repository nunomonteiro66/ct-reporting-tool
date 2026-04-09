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

  headerGroups.forEach((group, rowIndex) => {
    const rowsHeaders: Array<string | null> = [];
    const merges: { col: number; span: number }[] = [];

    //allows to correctly keep track of the column index
    //for example, if an header has 3 colspan, then the second header is going to be index=0+3=3
    let currentColIndex = 0;
    group.headers.forEach((header) => {
      if (header.isPlaceholder) {
        rowsHeaders.push(null);
        currentColIndex++;
        return;
      }

      const label = String(header.column.columnDef.header);
      const colSpan = header.colSpan;

      //rowsHeaders.push(label);
      rowsHeaders[currentColIndex] = label;

      if (colSpan > 1) {
        merges.push({
          col: currentColIndex,
          span: colSpan,
        });
      }

      currentColIndex += colSpan;
    });

    worksheet.addRow(rowsHeaders);

    // Apply merges using accurate visible-span positions
    merges.forEach(({ col, span }) => {
      worksheet.mergeCells(rowIndex + 1, col + 1, rowIndex + 1, col + span);
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

  // Set column widths based on visible leaf columns
  const leafHeaders = headerGroups
    .at(-1)!
    .headers.filter((h) => h.column.getIsVisible());

  leafHeaders.forEach((_, i) => {
    worksheet.getColumn(i + 1).width = 25;
  });

  // Add data rows
  table.getPrePaginationRowModel().rows.forEach((row) => {
    const visibleCells = row.getVisibleCells();
    worksheet.addRow(visibleCells.map((cell) => sanitize(cell.getValue())));
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
