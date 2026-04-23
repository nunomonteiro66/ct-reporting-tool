import { test, expect, Page } from '@playwright/test';
import { openAllProductsScreen } from './helpers';

async function headerClickCheck(
  page: Page,
  headerNum: number,
  expectedString: string
) {
  await page
    .locator(`thead tr:nth-child(2) th:nth-child(${headerNum})`)
    .click();
  await expect(
    page.locator(`tbody tr:nth-child(1) td:nth-child(${headerNum})`)
  ).toHaveText(expectedString);
}

test('columns sorting', async ({ page }) => {
  await openAllProductsScreen(page);

  //ascending key column
  await headerClickCheck(page, 1, 'C1278');

  //descending key column
  await headerClickCheck(page, 1, '417030009');

  //default key column
  await headerClickCheck(page, 1, '172591008');

  //ascending product name (en) column
  await headerClickCheck(page, 3, '1 x 800 + 95 PEX-Al-LT 24 kV');

  //descending product name (en) column
  await headerClickCheck(page, 3, '500 MM2(61X3,230MM)CU-KABEL UF.HR.');

  //default product name (en) column
  await headerClickCheck(page, 3, '1X2,5 H07V2-R BROWN');
});
