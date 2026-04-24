// filters.spec.js
import { test, expect } from '@playwright/test';
import { openAllProductsScreen } from './helpers';

test('category filter flow', async ({ page }) => {
  await openAllProductsScreen(page);

  //open attributes filter dropdown
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Add filter' }).click();
  await page.getByRole('option', { name: 'Attributes' }).click();

  //select 2 attributes
  await page.getByText('EL (0000_branch_code)').click();
  await page.getByText('Number of cores (').click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();

  //check if items exist in the selected
  await expect(page.getByRole('list', { name: 'attributes selected values' }))
    .toMatchAriaSnapshot(`
  - list "attributes selected values":
    - listitem: EL (0000_branch_code)
    - listitem: Number of cores (91_number_of_cores)
`);

  //clear all attributes
  await page.locator('#app').getByRole('button', { name: 'Clear all' }).click();

  //check if attributes were cleaned
  await expect(
    page.getByRole('list', { name: 'attributes selected values' })
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'Attributes:' }).click();
  await page.getByText('EL (0000_branch_code)').click();
  await page.getByText('Number of cores (').click();

  await page
    .getByRole('contentinfo')
    .getByRole('button', { name: 'Clear all' })
    .click();

  //checkbox should be unselected
  const checkbox = page
    .getByRole('option', { name: 'EL (0000_branch_code)' })
    .locator('input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
  const checkbox2 = page
    .getByRole('option', { name: 'Number of cores (' })
    .locator('input[type="checkbox"]');
  await expect(checkbox2).not.toBeChecked();

  await page.getByText('EL (0000_branch_code)').click();
  await page.getByText('Number of cores (').click();

  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await page.getByRole('button', { name: 'remove Attributes filter' }).click();

  //check if attributes were cleaned
  await expect(
    page.getByRole('list', { name: 'attributes selected values' })
  ).not.toBeVisible();
});
