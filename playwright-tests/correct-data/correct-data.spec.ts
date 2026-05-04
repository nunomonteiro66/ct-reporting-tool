import test, { expect } from '@playwright/test';
import { getJsonData, openAllProductsScreen, writeJsonData } from '../helpers';
import { writeFileSync, readFileSync } from 'fs';

const testSkus = [
  '112269037',
  '112381037',
  '165702004C0060',
  '120317013',
  'C96029',
  '112704010D0500',
  '172508003C0050',
  '112560017',
  '112707023',
  'C100669',
  '112271069D0500',
  '172547011D0500',
  '172508003D0500',
  '112269043D1000',
  '165702004C0100',
  '172120001',
  '112707023D0500',
  'C116431',
  'C89885',
  '112527006D0500',
];

test('correct data shown in table', async ({ page }) => {
  const expected = getJsonData('correct-data/expected.json');

  await openAllProductsScreen(page);

  //apply all attributes
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('button', { name: 'Add filter', exact: true }).click();
  await page.getByRole('option', { name: 'Attributes', exact: true }).click();
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();
  await page.getByRole('heading', { name: 'Products', exact: true }).click();

  //search skus in search bar
  await page.getByRole('switch', { name: 'Exact Match' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^All Columns$/ })
    .nth(4)
    .click();
  await page.getByRole('option', { name: 'SKU' }).click();

  //search for the ids
  const skus = testSkus.join(', ');
  await page.getByTestId('selectable-input').fill(skus);
  await page
    .getByRole('button', { name: 'search-button', exact: true })
    .click();

  //enable show NA columns
  await page.getByRole('switch', { name: 'Hide NA only columns' }).click();

  //wait until results are processed
  await expect(await page.locator('[id="total-results"]').innerText()).toBe(
    testSkus.length.toString()
  );

  const snapShot = await page.locator('tbody').ariaSnapshot();

  const allRows = await page.locator('tbody tr').all();

  const data = await Promise.all(
    allRows.map(async (row) => {
      const cells = await row.locator('td').all();
      return Promise.all(cells.map((cell) => cell.textContent()));
    })
  );

  console.log(data);

  writeFileSync('output.json', JSON.stringify(data, null, 2));
  writeJsonData('correct-data/output.json', data);

  await page.pause();

  expect(data).toEqual(expected);
});
