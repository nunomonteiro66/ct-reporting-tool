import { test, expect, Page } from '@playwright/test';
import { openAllProductsScreen } from './helpers';

async function checkTotalResultsByPagination(page: Page) {
  const totalPages = Number(
    await page.getByText('Pageof').locator('[id="total-pages"]').textContent()
  );
  const perPage = Number(await page.locator('select').inputValue());

  const totalResults = totalPages * perPage;

  const totalResultsShown = Number(
    await page.locator('[id="total-results"]').textContent()
  );

  //the last page can have less than the perPage count
  expect(totalResults).toBeGreaterThanOrEqual(totalResultsShown);
}

test('check total results', async ({ page }) => {
  await openAllProductsScreen(page);

  checkTotalResultsByPagination(page);

  //change the per page total
  await page.locator('select').selectOption('50');

  checkTotalResultsByPagination(page);

  //change a filter
  await page
    .getByRole('columnheader', { name: 'key', exact: true })
    .locator('#column-filter')
    .click();
  await page.getByRole('checkbox', { name: '110120000' }).check();
  await page.getByRole('button', { name: 'Apply' }).click();

  checkTotalResultsByPagination(page);
});
