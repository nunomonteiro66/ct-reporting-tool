import { expect, Page } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, readFileSync } from 'fs';

export async function openAllProductsScreen(page: Page) {
  await page.goto('http://localhost:3001/mynkt-production/ct-reporting-tool');

  await page.click('text=All product and variant attributes');

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible({
    timeout: 60000,
  });
}

export async function openImagesScreen(page: Page) {
  await page.goto('http://localhost:3001/mynkt-production/ct-reporting-tool');

  await page.click('text=All products images');

  await expect(page.getByRole('heading', { name: 'Images' })).toBeVisible({
    timeout: 60000,
  });
}

//check the columns in the table
export async function checkTableHeaders(
  page: Page,
  columns: string[],
  rowNumber = 1
) {
  await expect(page.locator('table')).toBeVisible();

  const actual = await page
    .locator(`thead tr:nth-child(${rowNumber}) th`)
    .evaluateAll((elements) => elements.map((el) => el.id));

  await expect(actual).toEqual(
    columns.map((t) => t.replaceAll('Ω', 'Ω').trim())
  );
}

export async function removeAllColumnsExceptKey(page: Page) {
  //open the columns orderer
  await page.getByRole('button').nth(4).click();

  //remove all except the first one (key)
  const panel = page.getByTestId('selected-columns-panel');
  const buttons = panel.getByRole('button', { name: 'Remove', exact: true });
  const count = await buttons.count();

  for (let i = 1; i < count; i++) {
    await buttons.nth(1).click();
  }

  //close the columns orderer
  await page.getByRole('button', { name: 'Close', exact: true }).click();
}

async function openFilters(page: Page) {
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Add filter' }).click();
}

export async function openAttributesFilter(page: Page) {
  await openFilters(page);
  await page.getByRole('option', { name: 'Attributes' }).click();
}

export async function dragToReorder(
  page: Page,
  sourceText: string,
  targetText: string
) {
  const source = page.getByRole('button', { name: sourceText });
  const target = page.getByRole('button', { name: targetText });

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  // start from the drag handle (the ⠿ icon on the left)
  await page.mouse.move(
    sourceBox!.x + 10,
    sourceBox!.y + sourceBox!.height / 2
  );
  await page.mouse.down();
  await page.waitForTimeout(500); // give time for drag to register

  // move to target position
  await page.mouse.move(
    targetBox!.x + 10,
    targetBox!.y + targetBox!.height / 2,
    { steps: 20 }
  );
  await page.waitForTimeout(300);
  await page.mouse.up();
  await page.waitForTimeout(500);
}

export async function openColumnFilter(page: Page, headerName: string) {
  await page
    .getByRole('columnheader', { name: headerName, exact: true })
    .locator('[id="column-filter"]')
    .click();
}

export async function setColumnFilters(
  page: Page,
  headerName: string,
  options: string[]
) {
  openColumnFilter(page, headerName);
  for (const option of options) {
    await page.locator('[id="filter-popover"]').getByText(option).click();
  }
  await page
    .locator('[id="filter-popover"]')
    .getByRole('button', { name: 'Apply' })
    .click();
}

export const getJsonData = (fileName: string) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, fileName);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
};

export const writeJsonData = (fileName: string, data: any) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, fileName);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
};
