import type { Response, PromptGenerationContext } from './types';

type KeywordCategory = 'physical' | 'emotional' | 'tactical' | 'relational' | 'moral';

const keywordMap: Record<KeywordCategory, string[]> = {
  physical: [
    'water',
    'sweat',
    'heat',
    'cold',
    'shelter',
    'cool',
    'shade',
    'temperature',
    'body',
    'exhaustion',
    'tired',
    'pain',
    'ache',
  ],
  emotional: [
    'scared',
    'fear',
    'lonely',
    'alone',
    'love',
    'hate',
    'hope',
    'despair',
    'angry',
    'upset',
    'happy',
    'sad',
  ],
  tactical: [
    'strategy',
    'plan',
    'tried',
    'tested',
    'method',
    'technique',
    'move',
    'careful',
    'risk',
    'careful',
    'worked',
    'failed',
  ],
  relational: ['people', 'settlement', 'iris', 'koss', 'venn', 'mara', 'sato', 'others', 'team', 'help'],
  moral: ['worth', 'purpose', 'meaning', 'believe', 'trust', 'sacrifice', 'duty', 'choice', 'commit'],
};

const categoryPrompts: Record<KeywordCategory, string[]> = {
  physical: [
    'Your body is pushing hard. What part of you needs the most recovery right now?',
    'Heat affects everyone differently. Are you noticing any warning signs your body gives you?',
    'You mentioned physical challenges. What would true rest look like for you?',
    'Every scar tells a story. What has the heat taught your body?',
  ],
  emotional: [
    "Behind the survival tactics, there's a person. How are you really feeling?",
    "Fear and hope often exist together in heat like this. What keeps you going?",
    "You're alone out there, but you're writing to us. What does that connection mean to you?",
    'Isolation can reshape how we feel about everything. What unexpected emotions have you discovered?',
  ],
  tactical: [
    'Your strategies are working. What made you think of that approach?',
    'You tested something and it worked. Have you thought about why?',
    'Every survival technique comes from somewhere. Where did you learn this?',
    "What's the difference between what you planned and what actually worked?",
  ],
  relational: [
    "You've connected with us. What would it mean to you to reach the settlement?",
    'People matter in survival, even separated by distance. Who are you thinking about out there?',
    'The settlement is listening to every word. Does that change how you survive?',
    'You have people depending on your data now. How does that feel?',
  ],
  moral: [
    'Your choices matter beyond just keeping yourself alive. Does that change your decisions?',
    'Survival becomes something different when it serves a purpose. What is yours?',
    'What do you believe is worth sacrificing for?',
    "How has your sense of what matters most changed since you started this journey with us?",
  ],
};

export const detectKeywords = (text: string): KeywordCategory[] => {
  const lowerText = text.toLowerCase();
  const detected: KeywordCategory[] = [];

  (Object.entries(keywordMap) as Array<[KeywordCategory, string[]]>).forEach(([category, keywords]) => {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      detected.push(category);
    }
  });

  return detected;
};

export const generatePrompts = (context: PromptGenerationContext): string[] => {
  const { response, currentDay } = context;

  const detectedCategories = detectKeywords(response);

  if (detectedCategories.length === 0) {
    return [
      "You're surviving. But what's keeping you human out there?",
      'There might be more to explore about your experience. What else do you want to share?',
    ];
  }

  const prompts: string[] = [];
  const seenPrompts = new Set<string>();

  // Add prompts from detected categories
  detectedCategories.forEach((category) => {
    const categoryQuestions = categoryPrompts[category];
    const randomPrompt = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

    if (!seenPrompts.has(randomPrompt)) {
      prompts.push(randomPrompt);
      seenPrompts.add(randomPrompt);
    }
  });

  // Add narrative escalation based on day
  if (currentDay === 11) {
    prompts.push('Tomorrow is the peak heat. This is your last message before the worst of it. What do you need to say?');
  } else if (currentDay === 12) {
    prompts.push('You made it through the peak. How does survival feel now?');
  } else if (currentDay >= 5) {
    prompts.push(
      "You're halfway through. How has your understanding of survival changed since you started?"
    );
  }

  // Inject settlement-relational prompts as game progresses
  if (currentDay >= 8 && detectedCategories.includes('moral')) {
    prompts.push('The settlement is counting on your data now. Does that feel like purpose or pressure?');
  }

  return prompts.slice(0, 3); // Return top 3 prompts
};

export const analyzeResponseTone = (text: string): 'hopeful' | 'desperate' | 'determined' | 'neutral' => {
  const lowerText = text.toLowerCase();

  const hopefulWords = ['hope', 'survive', 'make it', 'will', 'can', 'believe', 'try'];
  const desperateWords = ['dying', 'fail', 'lost', 'end', 'breaking', 'can\'t'];
  const determinedWords = ['push', 'fight', 'must', 'will not', 'force', 'keep', 'continue'];

  const hopefulCount = hopefulWords.filter((w) => lowerText.includes(w)).length;
  const desperateCount = desperateWords.filter((w) => lowerText.includes(w)).length;
  const determinedCount = determinedWords.filter((w) => lowerText.includes(w)).length;

  if (desperateCount > hopefulCount && desperateCount > determinedCount) return 'desperate';
  if (determinedCount > hopefulCount && determinedCount > 0) return 'determined';
  if (hopefulCount > 0) return 'hopeful';

  return 'neutral';
};

export const suggestNextSteps = (
  previousResponses: Response[]
): { message: string; hint?: string } => {
  const recentCount = previousResponses.length;

  if (recentCount === 0) {
    return {
      message:
        'Your first response is critical. Tell us how you survived your first day in this heat.',
    };
  }

  if (recentCount === 4) {
    return {
      message:
        "You're approaching the dangerous point. Heat exposure accumulates. How are you managing recovery?",
      hint: 'Think about your body, not just your tactics.',
    };
  }

  if (recentCount === 7) {
    return {
      message:
        "We're asking you to take a risk soon. Are you ready? Do you understand why it matters?",
      hint: 'Consider what the settlement means to you.',
    };
  }

  return { message: "Keep surviving. Keep reporting. You're helping us all." };
};
