import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data, columns, fileName = "data.xlsx") => {
  console.log("Begining export");
  const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, part) => {
      if (acc === undefined || acc === null) return "";

      return acc[part]; // bracket access handles numeric keys correctly
    }, obj);
  };

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Define only your selected columns
  worksheet.columns = columns.map((col) => ({
    header: col.label,
    key: col.key,
    width: 25,
  }));

  // Add rows using only selected keys
  data.forEach((row) => {
    const formattedRow = {};

    columns.forEach((col) => {
      formattedRow[col.key] = getValueByPath(row, col.key);
    });

    worksheet.addRow(formattedRow);
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
};
