export interface GameState {
  characterName: string;
  currentDay: number;
  responses: Response[];
  stats: GameStats;
  lastLetterTime: number;
  nextLetterTime: number;
  gameStarted: boolean;
  gameCompleted: boolean;
}

export interface Response {
  day: number;
  letter: Letter;
  content: string;
  submittedAt: number;
  generatedPrompts: string[];
}

export interface Letter {
  day: number;
  from: string;
  subject: string;
  body: string;
}

export interface GameStats {
  heatTacticsCount: number;
  relationshipsFormed: number;
  settlementMorale: number;
  waterPreserved: number;
  alliesGained: number;
}

export interface PromptGenerationContext {
  response: string;
  previousResponses: Response[];
  currentDay: number;
}
