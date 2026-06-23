import { test, expect } from '@playwright/test';

test.describe('Survive the Heat - Game Logic', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
  });

  test.describe('Start Screen', () => {
    test('should display title and character name input', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Survive the Heat');
      await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible();
    });

    test('should have disabled begin button initially', async ({ page }) => {
      const beginButton = page.locator('button:has-text("Begin")');
      await expect(beginButton).toBeDisabled();
    });

    test('should enable begin button when character name is entered', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');

      await input.fill('Alex');
      await expect(beginButton).toBeEnabled();
    });

    test('should limit character name to 30 characters', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const longName = 'A'.repeat(50);

      await input.fill(longName);
      const value = await input.inputValue();

      expect(value.length).toBeLessThanOrEqual(30);
    });

    test('should start game when begin button is clicked', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');

      await input.fill('Alex');
      await beginButton.click();

      // Wait for game screen to load
      await expect(page.locator('text=Day 1 of 12')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Game Screen - First Letter', () => {
    test.beforeEach(async ({ page }) => {
      // Start a game
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      // Wait for first letter to load
      await page.waitForTimeout(500);
    });

    test('should display first letter from Iris', async ({ page }) => {
      await expect(page.locator('text=Welcome to New Hope')).toBeVisible();
      await expect(page.locator('text=Iris, Settlement Comms Officer')).toBeVisible();
    });

    test('should show Day 1 of 12 counter', async ({ page }) => {
      await expect(page.locator('text=Day 1 of 12')).toBeVisible();
    });

    test('should have response form ready for input', async ({ page }) => {
      const textarea = page.locator('textarea');
      await expect(textarea).toBeVisible();
      await expect(textarea).toBeEnabled();
    });

    test('should accept character name in letter body', async ({ page }) => {
      // Letter should be personalized with character name
      const letterBody = page.locator('.letter-body');
      await expect(letterBody).toContainText('Alex');
    });
  });

  test.describe('Response Submission', () => {
    test.beforeEach(async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();
      await page.waitForTimeout(500);
    });

    test('should require text to submit response', async ({ page }) => {
      const submitButton = page.locator('button:has-text("Send Response")');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when text is entered', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');

      await textarea.fill('I survived by staying in the shade.');
      await expect(submitButton).toBeEnabled();
    });

    test('should submit response and advance to waiting state', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');

      await textarea.fill('I stayed hydrated and avoided the peak heat hours.');
      await submitButton.click();

      // Should show waiting state
      await expect(page.locator('text=Next letter in')).toBeVisible({ timeout: 5000 });
    });

    test('should show character count', async ({ page }) => {
      const textarea = page.locator('textarea');
      const testText = 'Testing the character counter';

      await textarea.fill(testText);

      // Character count should show
      await expect(page.locator(`text=${testText.length} characters`)).toBeVisible();
    });

    test('should save response to history', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      const testResponse = 'I found an old well and drank deeply.';

      await textarea.fill(testResponse);
      await submitButton.click();

      // Wait for state update
      await page.waitForTimeout(1000);

      // Open history
      const historyButton = page.locator('button[title="View history"]');
      await historyButton.click();

      // Response should be in history
      await expect(page.locator(`text=${testResponse}`)).toBeVisible();
    });
  });

  test.describe('Game State Persistence', () => {
    test('should persist game state to localStorage', async ({ page }) => {
      // Start game
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      // Submit response
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      await textarea.fill('I drank water and stayed cool.');
      await submitButton.click();

      // Check localStorage
      const gameState = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}')
      );

      expect(gameState.characterName).toBe('Alex');
      expect(gameState.currentDay).toBe(2);
      expect(gameState.responses.length).toBe(1);
    });

    test('should reload game state from localStorage', async ({ page }) => {
      // Start and submit in first session
      let input = page.locator('input[placeholder="Your name..."]');
      let beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      await textarea.fill('I survived the heat.');
      await submitButton.click();

      // Reload page
      await page.reload();

      // Should load saved game (skip splash screen)
      await expect(page.locator('text=Day 2 of 12')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Alex')).toBeVisible();
    });
  });

  test.describe('Stats Tracking', () => {
    test('should initialize morale at 50%', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      // Check morale stat
      await expect(page.locator('text=Settlement Morale')).toBeVisible();
      // Initial morale should be around 50%
      const moraleValue = page.locator('span:has-text("50")');
      await expect(moraleValue).toBeVisible();
    });

    test('should increase morale with hopeful response', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      // Get initial morale (stored in element)
      const initialMorale = await page.evaluate(() => {
        const gameState = JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}');
        return gameState.stats.settlementMorale;
      });

      // Submit hopeful response
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      const hopefulText = 'I hope to survive this. I believe we can make it together!';
      await textarea.fill(hopefulText);
      await submitButton.click();

      await page.waitForTimeout(500);

      // Check morale increased
      const newMorale = await page.evaluate(() => {
        const gameState = JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}');
        return gameState.stats.settlementMorale;
      });

      expect(newMorale).toBeGreaterThan(initialMorale);
    });
  });

  test.describe('Progress Through Game', () => {
    test('should progress through multiple days', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      // Submit responses for days 1-3
      for (let day = 1; day <= 3; day++) {
        const textarea = page.locator('textarea');
        const submitButton = page.locator('button:has-text("Send Response")');

        // Skip if waiting state
        const waitingState = page.locator('text=Next letter in');
        if (await waitingState.isVisible()) {
          // Use skip button to advance
          const skipButton = page.locator('button[title="Skip to next letter"]');
          if (await skipButton.isVisible()) {
            await skipButton.click();
            await page.waitForTimeout(500);
          }
        }

        await textarea.fill(`Day ${day} response: I survived by staying hydrated.`);
        await submitButton.click();
        await page.waitForTimeout(500);
      }

      // Should be on day 4
      const gameState = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}')
      );
      expect(gameState.currentDay).toBe(4);
      expect(gameState.responses.length).toBe(3);
    });
  });

  test.describe('Reset Game', () => {
    test('should reset game state', async ({ page }) => {
      // Start game and submit response
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      await textarea.fill('I survived.');
      await submitButton.click();

      // Click reset button
      const resetButton = page.locator('button[title="Reset game"]');
      await resetButton.click();

      // Accept confirmation dialog
      page.on('dialog', dialog => {
        dialog.accept();
      });

      // Should be back at start screen
      await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible({ timeout: 5000 });

      // localStorage should be cleared
      const gameState = await page.evaluate(() =>
        localStorage.getItem('survive_the_heat_game')
      );
      expect(gameState).toBeNull();
    });
  });

  test.describe('Export Functionality', () => {
    test('should export game as markdown', async ({ page, context }) => {
      // Start game and submit response
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Begin")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Response")');
      await textarea.fill('I survived by staying cool.');
      await submitButton.click();

      await page.waitForTimeout(500);

      // Listen for download
      const downloadPromise = context.waitForEvent('download');

      // Click export button
      const exportButton = page.locator('button[title="Export as markdown"]');
      await exportButton.click();

      const download = await downloadPromise;

      // Check download path contains character name
      expect(download.suggestedFilename()).toContain('Alex');
      expect(download.suggestedFilename()).toContain('.md');
    });
  });

  test.describe('Animation Toggle', () => {
    test('should disable animations when toggled', async ({ page }) => {
      const toggleButton = page.locator('button[title*="animations"]');

      // Click to disable
      await toggleButton.click();

      // Check if no-animations class is added
      const bodyClass = await page.evaluate(() => document.body.className);
      expect(bodyClass).toContain('no-animations');
    });

    test('should enable animations when toggled again', async ({ page }) => {
      const toggleButton = page.locator('button[title*="animations"]');

      // Click twice to toggle back
      await toggleButton.click();
      await toggleButton.click();

      // Check if no-animations class is removed
      const bodyClass = await page.evaluate(() => document.body.className);
      expect(bodyClass).not.toContain('no-animations');
    });
  });
});
