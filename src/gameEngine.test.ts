import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  initializeGame,
  loadGameState,
  getCurrentLetter,
  isLetterReady,
  submitResponse,
  getTimeUntilNextLetter,
  formatTimeRemaining,
  exportGameAsMarkdown,
  resetGame,
} from './gameEngine';

describe('Game Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initializeGame', () => {
    it('creates a new game with character name', () => {
      const state = initializeGame('TestChar');
      expect(state.characterName).toBe('TestChar');
      expect(state.currentDay).toBe(1);
      expect(state.responses).toEqual([]);
      expect(state.gameStarted).toBe(true);
      expect(state.gameCompleted).toBe(false);
    });

    it('saves game state to localStorage', () => {
      initializeGame('TestChar');
      const saved = localStorage.getItem('survive_the_heat_game');
      expect(saved).toBeDefined();
    });

    it('initializes stats correctly', () => {
      const state = initializeGame('TestChar');
      expect(state.stats.heatTacticsCount).toBe(0);
      expect(state.stats.relationshipsFormed).toBe(0);
      expect(state.stats.settlementMorale).toBe(50);
    });
  });

  describe('loadGameState', () => {
    it('loads existing game state', () => {
      const initial = initializeGame('TestChar');
      const loaded = loadGameState();
      expect(loaded).toEqual(initial);
    });

    it('returns null when no game exists', () => {
      const loaded = loadGameState();
      expect(loaded).toBeNull();
    });
  });

  describe('getCurrentLetter', () => {
    it('returns letter for current day with character name replaced', () => {
      const state = initializeGame('Zara');
      const letter = getCurrentLetter(state);
      expect(letter).toBeDefined();
      expect(letter?.day).toBe(1);
      expect(letter?.body).toContain('Zara');
      expect(letter?.body).not.toContain('[NAME]');
    });

    it('returns null after all letters are sent', () => {
      const state = initializeGame('TestChar');
      state.currentDay = 13;
      const letter = getCurrentLetter(state);
      expect(letter).toBeNull();
    });
  });

  describe('submitResponse', () => {
    it('records response and advances day', () => {
      const state = initializeGame('TestChar');
      const updated = submitResponse(state, 'I survived by staying hydrated.');
      expect(updated.responses).toHaveLength(1);
      expect(updated.currentDay).toBe(2);
    });

    it('generates prompts for response', () => {
      const state = initializeGame('TestChar');
      const updated = submitResponse(state, 'I used water to survive.');
      expect(updated.responses[0].generatedPrompts.length).toBeGreaterThan(0);
    });

    it('updates stats based on response content', () => {
      const state = initializeGame('TestChar');
      const longResponse = 'I preserved water and managed heat tactics by staying in the shade during peak hours. I tested various shelter designs and found that reflective materials work best. The settlement will learn from these discoveries.';
      const updated = submitResponse(state, longResponse);
      expect(updated.stats.waterPreserved).toBeGreaterThan(0);
      expect(updated.stats.heatTacticsCount).toBeGreaterThan(0);
    });

    it('updates morale based on response tone', () => {
      const state = initializeGame('TestChar');
      const hopeful = submitResponse(state, 'I have hope I will survive and believe we can make it.');
      expect(hopeful.stats.settlementMorale).toBeGreaterThan(50);
    });

    it('marks game as completed on last day', () => {
      const state = initializeGame('TestChar');
      state.currentDay = 12;
      const updated = submitResponse(state, 'I made it.');
      expect(updated.gameCompleted).toBe(true);
    });
  });

  describe('isLetterReady', () => {
    it('returns true when current time exceeds next letter time', () => {
      const state = initializeGame('TestChar');
      state.nextLetterTime = Date.now() - 1000;
      expect(isLetterReady(state)).toBe(true);
    });

    it('returns true on a fresh game (first letter is available immediately)', () => {
      const state = initializeGame('TestChar');
      expect(isLetterReady(state)).toBe(true);
    });

    it('returns false when the next letter time is still in the future', () => {
      const state = initializeGame('TestChar');
      state.nextLetterTime = Date.now() + 60_000;
      expect(isLetterReady(state)).toBe(false);
    });
  });

  describe('getTimeUntilNextLetter', () => {
    it('returns positive time when letter is not ready', () => {
      const state = initializeGame('TestChar');
      state.nextLetterTime = Date.now() + 60_000;
      const time = getTimeUntilNextLetter(state);
      expect(time).toBeGreaterThan(0);
    });

    it('returns 0 when letter is ready', () => {
      const state = initializeGame('TestChar');
      state.nextLetterTime = Date.now() - 1000;
      const time = getTimeUntilNextLetter(state);
      expect(time).toBe(0);
    });
  });

  describe('formatTimeRemaining', () => {
    it('formats hours and minutes', () => {
      const ms = (1 * 60 * 60 * 1000) + (30 * 60 * 1000);
      expect(formatTimeRemaining(ms)).toBe('1h 30m');
    });

    it('formats minutes and seconds', () => {
      const ms = (5 * 60 * 1000) + (30 * 1000);
      expect(formatTimeRemaining(ms)).toBe('5m 30s');
    });

    it('formats seconds only', () => {
      const ms = 45 * 1000;
      expect(formatTimeRemaining(ms)).toBe('45s');
    });

    it('handles 0 milliseconds', () => {
      expect(formatTimeRemaining(0)).toBe('0s');
    });
  });

  describe('exportGameAsMarkdown', () => {
    it('exports game state as markdown', () => {
      const state = initializeGame('TestChar');
      const updated = submitResponse(state, 'I survived by finding shelter.');
      const markdown = exportGameAsMarkdown(updated);
      expect(markdown).toContain('TestChar');
      expect(markdown).toContain('Survive the Heat');
      expect(markdown).toContain('I survived by finding shelter.');
    });

    it('includes stats in export', () => {
      const state = initializeGame('TestChar');
      const updated = submitResponse(state, 'I preserved water.');
      const markdown = exportGameAsMarkdown(updated);
      expect(markdown).toContain('Survival Stats');
      expect(markdown).toContain('Days Survived');
    });
  });

  describe('resetGame', () => {
    it('removes game from localStorage', () => {
      initializeGame('TestChar');
      resetGame();
      const loaded = loadGameState();
      expect(loaded).toBeNull();
    });
  });

  describe('game flow', () => {
    it('completes a full 12-day game', () => {
      const state = initializeGame('Hero');
      let current = state;

      for (let i = 1; i <= 12; i++) {
        expect(current.currentDay).toBe(i);
        expect(current.gameCompleted).toBe(false);

        const letter = getCurrentLetter(current);
        expect(letter).toBeDefined();
        expect(letter?.day).toBe(i);

        current = submitResponse(current, `Day ${i} response: I survived.`);
      }

      expect(current.gameCompleted).toBe(true);
      expect(current.responses).toHaveLength(12);
    });
  });
});
