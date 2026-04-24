import { test, expect } from '@playwright/test';
import { checkTableHeaders, openAllProductsScreen } from './helpers';

const defaultColumnsKeys = [
  'key',
  'sku',
  'names.en',
  'productType.key',
  'productType.name',
  'image',
  'datasheet',
  'dop',
  'doc',
  'epd',
  'categories',
  'selections',
  'descriptions.en',
];

test('check table headers', async ({ page }) => {
  await openAllProductsScreen(page);
  await checkTableHeaders(page, defaultColumnsKeys, 2);
});
