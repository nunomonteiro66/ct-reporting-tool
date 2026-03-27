import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const sanitize = (value) => {
  if (value === '' || value === undefined || value === null) return null;
  if (Array.isArray(value))
    return value.length === 1 ? String(value[0]) : value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
};

const getValueByPath = (obj, path) => {
  // First try the key literally (handles flat "images.0.name" keys)
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return sanitize(obj[path]);
  }
  // Fall back to nested traversal for real nested objects
  return sanitize(
    path.split('.').reduce((acc, part) => {
      if (acc === undefined || acc === null) return null;
      if (Array.isArray(acc)) return acc[Number(part)] ?? null;
      return acc[part] ?? null;
    }, obj)
  );
};

export const exportToExcel = async (data, columns, fileName = 'data.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columns.map((col) => ({
    header: col.label,
    key: col.key,
    width: 25,
  }));

  data.forEach((row) => {
    const formattedRow = {};
    columns.forEach((col) => {
      formattedRow[col.key] = getValueByPath(row, col.key);
    });
    worksheet.addRow(formattedRow);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    fileName
  );
};
