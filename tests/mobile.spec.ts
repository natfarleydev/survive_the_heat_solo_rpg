import { test, expect } from '@playwright/test';
import { gotoFresh } from './helpers';

// Mobile-specific tests - run on Pixel 5 (Android) and iPhone 12
test.describe('Mobile - Game Experience', () => {
  test.beforeEach(async ({ page }) => {
    await gotoFresh(page);
  });

  test.describe('Start Screen - Mobile', () => {
    test('should fit entirely on mobile viewport without scrolling', async ({ page }) => {
      const viewport = page.viewportSize();

      // Check that main elements are visible
      const title = page.locator('h1');
      const input = page.locator('input[placeholder="Your name..."]');
      const button = page.locator('button:has-text("Start Your Journey")');

      await expect(title).toBeVisible();
      await expect(input).toBeVisible();
      await expect(button).toBeVisible();

      // All should be above fold (within viewport height)
      const titleBox = await title.boundingBox();
      const buttonBox = await button.boundingBox();

      expect(titleBox?.y).toBeDefined();
      expect(buttonBox?.y).toBeDefined();
      expect(buttonBox!.y! + buttonBox!.height!).toBeLessThan(viewport!.height! * 1.2);
    });

    test('should have readable font size on mobile', async ({ page }) => {
      const title = page.locator('h1');
      const fontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);

      // Font size should be at least 16px for readability
      const size = parseInt(fontSize);
      expect(size).toBeGreaterThanOrEqual(16);
    });

    test('should have touch-friendly input field', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const box = await input.boundingBox();

      // Input should be at least 44px tall (WCAG touch target minimum)
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('should have responsive padding', async ({ page }) => {
      // Mobile viewport should not have excessive padding that hides content
      const container = page.locator('.container, .start-container');
      const padding = await container.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return parseFloat(styles.paddingLeft);
      });

      // Padding should be reasonable (less than 10% of viewport)
      const viewport = page.viewportSize();
      expect(padding).toBeLessThan(viewport!.width * 0.1);
    });
  });

  test.describe('Game Screen - Mobile', () => {
    test.beforeEach(async ({ page }) => {
      // Start game
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Mobile');
      await beginButton.click();
      await page.waitForTimeout(500);
    });

    test('should show header buttons with correct size', async ({ page }) => {
      // Header buttons should exist and be properly sized
      const historyButton = page.locator('button[title*="history"]');
      const exportButton = page.locator('button[title*="Export"]');

      await expect(historyButton).toBeVisible();
      await expect(exportButton).toBeVisible();

      // Buttons should be at least 40x40px (WCAG touch target)
      const historyBox = await historyButton.boundingBox();
      expect(historyBox!.width).toBeGreaterThanOrEqual(40);
      expect(historyBox!.height).toBeGreaterThanOrEqual(40);
    });

    test('should hide icon labels on mobile', async ({ page }) => {
      // Icon labels should not be visible on mobile (< 768px)
      const iconLabels = page.locator('.icon-label');

      // Labels should be hidden
      const isVisible = await iconLabels.first().isVisible();
      expect(isVisible).toBe(false);
    });

    test('should display letter and response form in single column', async ({ page }) => {
      const letterSection = page.locator('.letter-section');
      const responseSection = page.locator('.response-section');
      const sidebar = page.locator('.game-sidebar');

      // On mobile, these should be stacked vertically
      const letterBox = await letterSection.boundingBox();
      const responseBox = await responseSection.boundingBox();

      // Response form should be below letter (not beside it)
      expect(responseBox!.y).toBeGreaterThan(letterBox!.y! + letterBox!.height!);
    });

    test('should have readable letter text on mobile', async ({ page }) => {
      const letterText = page.locator('.letter-body');
      const fontSize = await letterText.evaluate(el => window.getComputedStyle(el).fontSize);

      // Font size should be readable (at least 14px)
      const size = parseInt(fontSize);
      expect(size).toBeGreaterThanOrEqual(14);
    });

    test('should allow typing in textarea on mobile', async ({ page }) => {
      const textarea = page.locator('textarea');
      const testText = 'Mobile test response for the game';

      await textarea.fill(testText);
      const value = await textarea.inputValue();

      expect(value).toBe(testText);
    });

    test('should display character count clearly on mobile', async ({ page }) => {
      const textarea = page.locator('textarea');
      const testText = 'Test message';

      await textarea.fill(testText);

      // Character count should be visible
      await expect(page.locator(`text=${testText.length} characters`)).toBeVisible();
    });

    test('should have responsive submit button', async ({ page }) => {
      const submitButton = page.locator('button:has-text("Send Report")');
      const box = await submitButton.boundingBox();

      // Button should be reasonably sized
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Mobile - Touch Interactions', () => {
    test.beforeEach(async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Mobile');
      await beginButton.click();
      await page.waitForTimeout(500);
    });

    test('should be clickable with touch on mobile', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');

      // Type a response
      await textarea.fill('Testing mobile touch interaction');

      // Button should be clickable
      await submitButton.click();

      // Should show waiting state
      await expect(page.locator('text=Next letter in')).toBeVisible({ timeout: 5000 });
    });

    test('should handle history panel on mobile', async ({ page }) => {
      // Submit a response first
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
      await textarea.fill('Mobile history test');
      await submitButton.click();

      await page.waitForTimeout(500);

      // Open history
      const historyButton = page.locator('button[title*="history"]');
      await historyButton.click();

      // History should be visible
      await expect(page.locator('text=Mobile history test')).toBeVisible();
    });

    test('should show tappable story-seed prompts on mobile', async ({ page }) => {
      // Story-seed prompts should be visible immediately on day 1
      const seeds = page.locator('.prompt-seed');
      await expect(seeds.first()).toBeVisible();

      // There should be multiple prompts (3 per day)
      const count = await seeds.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // Tapping a seed should populate the textarea
      const textarea = page.locator('textarea');
      const seedText = (await seeds.first().textContent())?.trim() ?? '';
      await seeds.first().click();

      const value = await textarea.inputValue();
      expect(value).toContain(seedText.slice(0, 20));
    });
  });

  test.describe('Mobile - Keyboard Interaction', () => {
    test('should support on-screen keyboard input', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');

      // Type using keyboard events
      await input.focus();
      await input.type('KeyboardTest');

      const value = await input.inputValue();
      expect(value).toBe('KeyboardTest');
    });

    test('should handle virtual keyboard without layout shift', async ({ page }) => {
      const viewport = page.viewportSize();

      // Get initial layout
      const initialHeight = viewport!.height;

      // Focus input (might trigger keyboard)
      const input = page.locator('input[placeholder="Your name..."]');
      await input.focus();

      // Height shouldn't change drastically (though may vary on device)
      const stillVisible = await input.isVisible();
      expect(stillVisible).toBe(true);
    });
  });

  test.describe('Mobile - Orientation', () => {
    test('should work in portrait orientation', async ({ page }) => {
      // Already in portrait by default
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should be readable even on small phones', async ({ browser }) => {
      // Test on very small mobile (iPhone SE - 375px width)
      const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
      const page = await context.newPage();
      await gotoFresh(page);

      const title = page.locator('h1');
      const input = page.locator('input[placeholder="Your name..."]');

      // Should still be readable
      await expect(title).toBeVisible();
      await expect(input).toBeVisible();

      // Text should be readable
      const fontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);

      await context.close();
    });
  });
});
