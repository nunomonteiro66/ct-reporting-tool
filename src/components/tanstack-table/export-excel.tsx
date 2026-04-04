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

  // Build a set of visible leaf column IDs for fast lookup
  const visibleLeafIds = new Set(
    headerGroups
      .at(-1)!
      .headers.filter((h) => h.column.getIsVisible())
      .map((h) => h.column.id)
  );

  headerGroups.forEach((group, rowIndex) => {
    const rowValues: (string | null)[] = [];
    // Track (colIndex, colSpan) for merge operations — based on visible cols only
    const merges: { col: number; span: number }[] = [];

    let colIndex = 1;

    group.headers.forEach((h) => {
      // Compute how many visible leaf columns this header actually spans
      const visibleSpan = h.isPlaceholder
        ? 0
        : h.getLeafHeaders().filter((lh) => visibleLeafIds.has(lh.column.id))
            .length;

      if (visibleSpan === 0) return; // fully hidden, skip entirely

      const header = h.column.columnDef.header;
      const value = h.isPlaceholder
        ? null
        : Array.isArray(header)
        ? header.join(' ')
        : (header as string);

      // adiciona a célula principal
      rowValues.push(value);

      // 🔥 CRUCIAL: preencher o resto do span
      for (let i = 1; i < visibleSpan; i++) {
        rowValues.push(null);
      }

      if (visibleSpan > 1) {
        merges.push({ col: colIndex, span: visibleSpan });
      }

      colIndex += visibleSpan;
    });

    worksheet.addRow(rowValues);

    // Apply merges using accurate visible-span positions
    merges.forEach(({ col, span }) => {
      worksheet.mergeCells(rowIndex + 1, col, rowIndex + 1, col + span - 1);
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
  table.getCoreRowModel().rows.forEach((row) => {
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
