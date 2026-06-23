import { describe, it, expect } from 'vitest';
import {
  detectKeywords,
  generatePrompts,
  analyzeResponseTone,
  suggestNextSteps,
} from './promptGenerator';
import type { Response, PromptGenerationContext } from './types';

describe('Prompt Generator', () => {
  describe('detectKeywords', () => {
    it('detects physical category keywords', () => {
      const keywords = detectKeywords('I drank water and found shade for shelter.');
      expect(keywords).toContain('physical');
    });

    it('detects emotional category keywords', () => {
      const keywords = detectKeywords('I felt scared and alone but had hope.');
      expect(keywords).toContain('emotional');
    });

    it('detects tactical category keywords', () => {
      const keywords = detectKeywords('I tried a strategy that worked.');
      expect(keywords).toContain('tactical');
    });

    it('detects relational category keywords', () => {
      const keywords = detectKeywords('I thought about the settlement and Iris.');
      expect(keywords).toContain('relational');
    });

    it('detects moral category keywords', () => {
      const keywords = detectKeywords('This journey has meaning and purpose.');
      expect(keywords).toContain('moral');
    });

    it('handles multiple categories', () => {
      const keywords = detectKeywords(
        'I was scared but tried a strategy anyway. The settlement means everything.'
      );
      expect(keywords.length).toBeGreaterThan(1);
    });

    it('handles case insensitivity', () => {
      const keywords = detectKeywords('WATER AND SHELTER ARE IMPORTANT');
      expect(keywords).toContain('physical');
    });

    it('returns empty array for no matches', () => {
      const keywords = detectKeywords('xyz abc def');
      expect(keywords).toEqual([]);
    });
  });

  describe('generatePrompts', () => {
    it('generates prompts for detected categories', () => {
      const context: PromptGenerationContext = {
        response: 'I drank water and stayed cool.',
        previousResponses: [],
        currentDay: 1,
      };
      const prompts = generatePrompts(context);
      expect(prompts.length).toBeGreaterThan(0);
      expect(prompts.every((p) => typeof p === 'string')).toBe(true);
    });

    it('returns generic prompts when no categories detected', () => {
      const context: PromptGenerationContext = {
        response: 'xyz abc def',
        previousResponses: [],
        currentDay: 1,
      };
      const prompts = generatePrompts(context);
      expect(prompts.length).toBeGreaterThan(0);
    });

    it('adds escalation prompt for day 11', () => {
      const context: PromptGenerationContext = {
        response: 'I found water and shelter today.',
        previousResponses: [],
        currentDay: 11,
      };
      const prompts = generatePrompts(context);
      expect(prompts.some((p) => p.includes('peak'))).toBe(true);
    });

    it('adds completion prompt for day 12', () => {
      const context: PromptGenerationContext = {
        response: 'I found water and shelter today and made it through.',
        previousResponses: [],
        currentDay: 12,
      };
      const prompts = generatePrompts(context);
      expect(prompts.length > 0).toBe(true);
      expect(prompts.some((p) => typeof p === 'string')).toBe(true);
    });

    it('limits prompts to 3', () => {
      const context: PromptGenerationContext = {
        response:
          'I was scared and alone but tried a strategy. The water was important. The settlement means everything.',
        previousResponses: [],
        currentDay: 5,
      };
      const prompts = generatePrompts(context);
      expect(prompts.length).toBeLessThanOrEqual(3);
    });
  });

  describe('analyzeResponseTone', () => {
    it('identifies hopeful tone', () => {
      const tone = analyzeResponseTone('I have hope and believe I will survive.');
      expect(tone).toBe('hopeful');
    });

    it('identifies desperate tone', () => {
      const tone = analyzeResponseTone('I am dying and losing hope. Everything is failing.');
      expect(tone).toBe('desperate');
    });

    it('identifies determined tone', () => {
      const tone = analyzeResponseTone('I will push forward and fight. I must keep going.');
      expect(tone).toBe('determined');
    });

    it('defaults to neutral for minimal content', () => {
      const tone = analyzeResponseTone('xyz abc def');
      expect(tone).toBe('neutral');
    });

    it('handles case insensitivity', () => {
      const tone = analyzeResponseTone('I HAVE HOPE AND WILL SURVIVE');
      expect(['hopeful', 'determined']).toContain(tone);
    });
  });

  describe('suggestNextSteps', () => {
    it('suggests initial response on day 0', () => {
      const suggestion = suggestNextSteps([]);
      expect(suggestion.message).toContain('first');
    });

    it('suggests recovery focus around day 4', () => {
      const mockResponses: Response[] = Array(4)
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          letter: { day: i + 1, from: 'Test', subject: 'Test', body: 'Test' },
          content: 'Response',
          submittedAt: Date.now(),
          generatedPrompts: [],
        }));
      const suggestion = suggestNextSteps(mockResponses);
      expect(suggestion.message.toLowerCase()).toContain('recovery');
    });

    it('mentions risk and readiness around day 7', () => {
      const mockResponses: Response[] = Array(7)
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          letter: { day: i + 1, from: 'Test', subject: 'Test', body: 'Test' },
          content: 'Response',
          submittedAt: Date.now(),
          generatedPrompts: [],
        }));
      const suggestion = suggestNextSteps(mockResponses);
      expect(suggestion.message.toLowerCase()).toContain('risk');
    });
  });
});
