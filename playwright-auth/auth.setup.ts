// auth.setup.js
import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:3001/mynkt-production');

  await page.pause();

  // save the session
  await page.context().storageState({ path: 'auth.json' });
});
