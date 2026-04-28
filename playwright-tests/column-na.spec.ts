import { test, expect } from '@playwright/test';
import {
  checkTableHeaders,
  openAllProductsScreen,
  removeAllColumnsExceptKey,
} from './helpers';

test('column-na', async ({ page }) => {
  await openAllProductsScreen(page);

  await removeAllColumnsExceptKey(page);

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Add filter' }).click();
  await page.getByRole('option', { name: 'Attributes' }).click();
  await page
    .getByRole('option', { name: 'EAN (0000_barcode_ean_code)' })
    .click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();

  //open column filter
  await page
    .getByRole('columnheader', { name: 'key', exact: true })
    .locator('[id="column-filter"]')
    .click();

  await page.locator('[id="filter-popover"]').getByText('C100669').click();
  await page
    .locator('[id="filter-popover"]')
    .getByRole('button', { name: 'Apply' })
    .click();

  await expect(page.getByText('Hidden 1 attribute columns')).toBeVisible();
  await checkTableHeaders(page, ['key']);

  //remove the column filter
  await page.getByRole('button', { name: 'Remove', exact: true }).click();

  await expect(page.getByText('Hidden 1 attribute columns')).not.toBeVisible();
  await checkTableHeaders(page, ['key', 'attributes.0000_barcode_ean_code']);
});

//this ids should have N/A in this attributes, therefore the columns need to be hidden
test('column-na-several-ids', async ({ page }) => {
  const ids = [
    '112180103',
    '110192064',
    '120317013',
    '112183017',
    '122300002',
    '120311010',
    '160001076',
    '160001076',
  ];

  const attributes = [
    '1430_longitudinal_water_blocking_conductor',
    '1431_longitudinal_water_blocking_screen',
    '1432_radial_water_blocking',
    'esp_mechanical_protection',
    'esp_semiconductive_screen_over_sheath',
  ];

  await openAllProductsScreen(page);

  await removeAllColumnsExceptKey(page);

  //open column filter
  await page
    .getByRole('columnheader', { name: 'key', exact: true })
    .locator('[id="column-filter"]')
    .click();

  for (const id of ids) {
    await page.locator('[id="filter-popover"]').getByText(id).click();
  }

  await page
    .locator('[id="filter-popover"]')
    .getByRole('button', { name: 'Apply' })
    .click();

  //set the attributes filters
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Add filter' }).click();
  await page.getByRole('option', { name: 'Attributes' }).click();

  for (const attribute of attributes) {
    await page
      .getByRole('option', { name: attribute })
      .locator('label')
      .click();
  }

  await page.getByRole('button', { name: 'Apply', exact: true }).click();

  await expect(
    page.getByText(`Hidden ${attributes.length} attribute columns`)
  ).toBeVisible();

  await checkTableHeaders(page, ['key']);
});
