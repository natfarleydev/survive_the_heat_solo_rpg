import type { GameState, Response, Letter } from './types';
import { letterBank } from './letterBank';
import { generatePrompts, analyzeResponseTone } from './promptGenerator';

const STORAGE_KEY = 'survive_the_heat_game';
const LETTER_DELAY_MS = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

const createInitialState = (characterName: string): GameState => ({
  characterName,
  currentDay: 1,
  responses: [],
  stats: {
    heatTacticsCount: 0,
    relationshipsFormed: 0,
    settlementMorale: 50,
    waterPreserved: 0,
    alliesGained: 0,
  },
  lastLetterTime: Date.now(),
  nextLetterTime: Date.now() + LETTER_DELAY_MS,
  gameStarted: true,
  gameCompleted: false,
});

export const initializeGame = (characterName: string): GameState => {
  const state = createInitialState(characterName);
  saveGameState(state);
  return state;
};

export const loadGameState = (): GameState | null => {
  if (typeof window === 'undefined') return null;

  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveGameState = (state: GameState): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getCurrentLetter = (state: GameState): Letter | null => {
  if (state.currentDay > letterBank.length) return null;
  const letter = letterBank[state.currentDay - 1];
  return {
    ...letter,
    body: letter.body.replace(/\[NAME\]/g, state.characterName),
    from: letter.from.replace(/\[NAME\]/g, state.characterName),
  };
};

export const isLetterReady = (state: GameState): boolean => {
  return Date.now() >= state.nextLetterTime;
};

export const submitResponse = (state: GameState, responseText: string): GameState => {
  const currentLetter = getCurrentLetter(state);
  if (!currentLetter) return state;

  const newResponse: Response = {
    day: state.currentDay,
    letter: currentLetter,
    content: responseText,
    submittedAt: Date.now(),
    generatedPrompts: generatePrompts({
      response: responseText,
      previousResponses: state.responses,
      currentDay: state.currentDay,
    }),
  };

  const tone = analyzeResponseTone(responseText);
  const updatedStats = { ...state.stats };

  // Update stats based on response content
  if (responseText.toLowerCase().includes('water') || responseText.toLowerCase().includes('hydrat')) {
    updatedStats.waterPreserved += 10;
  }

  if (responseText.length > 200) {
    updatedStats.heatTacticsCount += 1;
  }

  if (responseText.toLowerCase().includes('settlement') || responseText.toLowerCase().includes('iris')) {
    updatedStats.relationshipsFormed += 1;
  }

  // Morale adjustment based on tone
  if (tone === 'hopeful') updatedStats.settlementMorale += 10;
  if (tone === 'determined') updatedStats.settlementMorale += 5;
  if (tone === 'desperate') updatedStats.settlementMorale -= 5;

  const isGameComplete = state.currentDay === letterBank.length;

  const newState: GameState = {
    ...state,
    responses: [...state.responses, newResponse],
    currentDay: state.currentDay + 1,
    stats: updatedStats,
    lastLetterTime: Date.now(),
    nextLetterTime: Date.now() + LETTER_DELAY_MS,
    gameCompleted: isGameComplete,
  };

  saveGameState(newState);
  return newState;
};

export const getTimeUntilNextLetter = (state: GameState): number => {
  const now = Date.now();
  const timeRemaining = Math.max(0, state.nextLetterTime - now);
  return timeRemaining;
};

export const formatTimeRemaining = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const exportGameAsMarkdown = (state: GameState): string => {
  const lines: string[] = [];

  lines.push(`# Survive the Heat - ${state.characterName}'s Journey`);
  lines.push('');
  lines.push(`**Days Survived:** ${state.currentDay - 1} / ${letterBank.length}`);
  lines.push(`**Status:** ${state.gameCompleted ? 'Completed - Reached New Hope' : 'In Progress'}`);
  lines.push('');

  lines.push('## Survival Stats');
  lines.push(`- Heat Tactics Discovered: ${state.stats.heatTacticsCount}`);
  lines.push(`- Relationships Formed: ${state.stats.relationshipsFormed}`);
  lines.push(`- Settlement Morale Impact: ${state.stats.settlementMorale}%`);
  lines.push(`- Water Preservation: ${state.stats.waterPreserved}L`);
  lines.push(`- Allies Gained: ${state.stats.alliesGained}`);
  lines.push('');

  lines.push('## Journey Log');
  lines.push('');

  state.responses.forEach((response) => {
    lines.push(`### Day ${response.day} - Response to "${response.letter.subject}"`);
    lines.push(`**From:** ${response.letter.from}`);
    lines.push(`**Time:** ${new Date(response.submittedAt).toLocaleString()}`);
    lines.push('');
    lines.push('**Response:**');
    lines.push('');
    lines.push(response.content);
    lines.push('');

    if (response.generatedPrompts.length > 0) {
      lines.push('**Reflection Prompts:**');
      response.generatedPrompts.forEach((prompt) => {
        lines.push(`- ${prompt}`);
      });
      lines.push('');
    }
  });

  return lines.join('\n');
};

export const downloadMarkdownExport = (state: GameState): void => {
  const markdown = exportGameAsMarkdown(state);
  const element = document.createElement('a');
  const file = new Blob([markdown], { type: 'text/markdown' });
  element.href = URL.createObjectURL(file);
  element.download = `survive_the_heat_${state.characterName.replace(/\s+/g, '_')}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const resetGame = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
