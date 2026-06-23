import { test, expect } from '@playwright/test';
import { gotoFresh, dismissSplash } from './helpers';

test.describe('Survive the Heat - Game Logic', () => {
  test.beforeEach(async ({ page }) => {
    // Fresh slate + skip the intro splash so the input is interactable.
    await gotoFresh(page);
  });

  test.describe('Start Screen', () => {
    test('should display title and character name input', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Survive the Heat');
      await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible();
    });

    test('should have disabled begin button initially', async ({ page }) => {
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await expect(beginButton).toBeDisabled();
    });

    test('should enable begin button when character name is entered', async ({ page }) => {
      const input = page.locator('input[placeholder="Your name..."]');
      const beginButton = page.locator('button:has-text("Start Your Journey")');

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
      const beginButton = page.locator('button:has-text("Start Your Journey")');

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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
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

    test('should show story-seed prompts immediately on day 1', async ({ page }) => {
      // Solo-RPG hook: evocative prompts must appear on the very first turn
      const seeds = page.locator('.prompt-seed');
      await expect(seeds.first()).toBeVisible();
      expect(await seeds.count()).toBeGreaterThanOrEqual(3);
    });

    test('should populate textarea when a story-seed is tapped', async ({ page }) => {
      const seeds = page.locator('.prompt-seed');
      const textarea = page.locator('textarea');

      const seedText = (await seeds.first().textContent())?.trim() ?? '';
      await seeds.first().click();

      const value = await textarea.inputValue();
      expect(value).toContain(seedText.slice(0, 20));
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();
      await page.waitForTimeout(500);
    });

    test('should require text to submit response', async ({ page }) => {
      const submitButton = page.locator('button:has-text("Send Report")');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when text is entered', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');

      await textarea.fill('I survived by staying in the shade.');
      await expect(submitButton).toBeEnabled();
    });

    test('should submit response and advance to waiting state', async ({ page }) => {
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');

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
      const submitButton = page.locator('button:has-text("Send Report")');
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      // Submit response
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
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
      let beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      // Get initial morale (stored in element)
      const initialMorale = await page.evaluate(() => {
        const gameState = JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}');
        return gameState.stats.settlementMorale;
      });

      // Submit hopeful response
      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      // Submit responses for days 1-3
      for (let day = 1; day <= 3; day++) {
        // If we're in the waiting state, skip ahead to the next letter.
        const skipButton = page.locator('button[title*="Skip"]');
        if (await skipButton.isVisible().catch(() => false)) {
          await skipButton.click();
        }

        // Wait for the report form to be ready before interacting (webkit can
        // lag through the letter/form transition).
        const textarea = page.locator('textarea');
        await textarea.waitFor({ state: 'visible' });
        await expect(textarea).toBeEnabled();

        await textarea.fill(`Day ${day} response: I survived by staying hydrated.`);

        const submitButton = page.locator('button:has-text("Send Report")');
        await submitButton.click();

        // Wait until the submission is persisted (day advanced) before looping.
        await expect
          .poll(async () =>
            page.evaluate(() => {
              const s = JSON.parse(localStorage.getItem('survive_the_heat_game') || '{}');
              return s.responses?.length ?? 0;
            })
          )
          .toBe(day);
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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
      await textarea.fill('I survived.');
      await submitButton.click();

      // Register the confirmation-dialog handler BEFORE triggering it.
      page.once('dialog', (dialog) => dialog.accept());

      // Click reset button (title is "Reset game and start over")
      const resetButton = page.locator('button[title*="Reset"]');
      await resetButton.click();

      // Should be back at the start screen (splash reappears — dismiss it)
      await dismissSplash(page);
      await expect(page.locator('input[placeholder="Your name..."]')).toBeVisible();

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
      const beginButton = page.locator('button:has-text("Start Your Journey")');
      await input.fill('Alex');
      await beginButton.click();

      const textarea = page.locator('textarea');
      const submitButton = page.locator('button:has-text("Send Report")');
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
});
