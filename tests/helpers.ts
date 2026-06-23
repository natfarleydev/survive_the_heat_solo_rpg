import type { Page } from '@playwright/test';

/**
 * The intro splash can be dismissed with a tap. Click it if present, then wait
 * for the character-name input to be ready.
 */
export async function dismissSplash(page: Page) {
  const splash = page.locator('.splash-screen');
  if (await splash.isVisible().catch(() => false)) {
    await splash.click();
  }
  await page.locator('input[placeholder="Your name..."]').waitFor({ state: 'visible' });
}

/**
 * Load the app with a clean slate: navigate, clear persisted state, reload, and
 * skip the splash so the character-name input is immediately interactable.
 * (localStorage can only be cleared after a real navigation — not on about:blank.)
 */
export async function gotoFresh(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await dismissSplash(page);
}
