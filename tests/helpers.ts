import type { Page } from '@playwright/test';

/**
 * The intro splash can be dismissed with a tap. Click it if present, then wait
 * for the character-name input to be ready.
 */
export async function dismissSplash(page: Page) {
  const input = page.locator('input[placeholder="Your name..."]');

  // If the input is already showing (returning user, or input phase), we're done.
  if (await input.isVisible().catch(() => false)) return;

  // Otherwise wait for the splash to actually mount, then click to skip it.
  // (Checking isVisible() at a single instant races the React mount and can
  // leave us waiting out the full 18s auto-advance — too slow on webkit.)
  const splash = page.locator('.splash-screen');
  try {
    await splash.waitFor({ state: 'visible', timeout: 3000 });
    await splash.click();
  } catch {
    // No splash appeared — fall through and wait for the input directly.
  }
  await input.waitFor({ state: 'visible', timeout: 20000 });
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
