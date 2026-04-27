import { test, expect, Page } from '@playwright/test';
import {
  dragToReorder,
  openAllProductsScreen,
  openAttributesFilter,
  setColumnFilters,
} from './helpers';
import * as XLSX from 'xlsx';
import { Buffer } from 'buffer';

async function downloadExcel(page: Page) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export Excel' }).click(),
  ]);

  return download;
}

async function readExcel(download) {
  const stream = await download.createReadStream();

  if (!stream) throw new Error('Failed to create stream');

  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const raw = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
  });
  return raw;
}

function normalizeRow(row: any[], length = row.length) {
  return Array.from({ length }, (_, i) => {
    const cell = row[i];
    if (cell === undefined || cell === null) return '';
    return String(cell).trim();
  });
}

test('check extracted excel headers', async ({ page }) => {
  await openAllProductsScreen(page);

  //activate all attributes
  await openAttributesFilter(page);
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();

  //activate all languages
  await page.getByRole('button', { name: 'Languages:', exact: true }).click();
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();

  //get the actual headers
  const headers = await page.locator('[id="header-label"]').allTextContents();

  const download = await downloadExcel(page);

  const excelContent = await readExcel(download);

  //check headers
  let actual = normalizeRow(excelContent[1], headers.length);
  let expected = normalizeRow(headers);
  expect(actual).toEqual(expected);
});

test('check extracted excel', async ({ page }) => {
  await openAllProductsScreen(page);

  //activate all attributes
  await openAttributesFilter(page);
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();

  //activate all languages
  await page.getByRole('button', { name: 'Languages:', exact: true }).click();
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();

  //re-order some columns
  await page.locator('[id="column-orderer-button"]').click();
  await dragToReorder(page, 'Product Type Key', 'SKU');
  await dragToReorder(page, 'Type (7_type)', 'Image');

  //set some column filters
  await setColumnFilters(page, 'Product Type Key', ['10120']);
  await setColumnFilters(
    page,
    'Number of group of product (544_number_of_group_of_product)',
    ['10120', '10138']
  );

  //get the actual headers
  const headers = await page.locator('[id="header-label"]').allTextContents();

  //change the perPage results
  await page.locator('select').selectOption('50');

  const download = await downloadExcel(page);

  const excelContent = await readExcel(download);

  //check headers
  let actual = normalizeRow(excelContent[1], headers.length);
  let expected = normalizeRow(headers);
  expect(actual).toEqual(expected);

  //check the first paginated data
  const totalRows = await page.locator('tbody tr').count();
  const excelDataNormalized = excelContent
    .slice(2, totalRows + 2)
    .map((row) => normalizeRow(row));

  const tableDataNormalized = [];

  for (let i = 1; i <= totalRows; i++) {
    const rowData = normalizeRow(
      await page.locator(`tbody tr:nth-child(${i}) td`).allTextContents()
    );
    tableDataNormalized.push(rowData);
  }

  expect(excelDataNormalized).toEqual(tableDataNormalized);
});
