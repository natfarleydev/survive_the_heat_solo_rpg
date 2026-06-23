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

/**
 * Curated, evocative story-seeds for each day — the heart of the solo-RPG
 * experience. Unlike the reactive prompts below (which respond to what the
 * player already wrote), these are always shown so every day opens with
 * concrete, sensory angles to write into. Each set is tuned to the theme of
 * that day's letter. Second person, present tense, specific.
 */
const dailyPrompts: Record<number, string[]> = {
  1: [
    'Describe where you sheltered last night. What does it look, smell, and sound like at the hottest hour?',
    "What single object have you carried this far — and why can't you leave it behind?",
    'It is noon and the air shimmers. Walk us through the last hour, moment by moment.',
  ],
  2: [
    'Take stock of your body. Where does the heat live in you right now?',
    'When did you last drink? Describe the water — its taste, its warmth, how much is left.',
    'Look at your hands. What has the sun done to your skin this week?',
  ],
  3: [
    'Describe the land around you — the ruins, roads, or wreckage you can see from where you stand.',
    'Have you found anything useful out here? Tell us what, and what it cost you to reach it.',
    "Koss wants you to trust him about the cache. What does the word 'trust' mean to you now?",
  ],
  4: [
    'The worst heat is coming. Lay out your plan, step by step, as if teaching someone who has never survived a spike.',
    'What are you most afraid will go wrong in the next three days?',
    'Where will you be when the temperature peaks? Paint us the picture of that hiding place.',
  ],
  5: [
    "When did you last hear a voice that wasn't your own? What has the silence started to sound like?",
    'Describe a moment today when your mind played a trick on you — a sound, a shape, a face.',
    'If you let yourself feel one thing right now, what would it be?',
  ],
  6: [
    'Describe something you built, fixed, or rigged to survive. How does it work?',
    'What ordinary object have you turned into a tool the old world never intended?',
    'Sato speaks your language — desperate engineering. Teach us your best trick.',
  ],
  7: [
    'The spike has passed and you are still here. How? Walk us through the worst hour of it.',
    'What did this heat wave take from you — and what did it leave behind?',
    'You survived something that takes most people. Sit with that a moment. What does it feel like?',
  ],
  8: [
    'You are being asked to cross the killing heat for the cache. Describe the moment you decide.',
    'What would it mean to save fifty strangers you have never met?',
    'Describe the way out — the distance, the glare, the thing that almost stopped you.',
  ],
  9: [
    'Why are you still answering these messages? Be honest with us.',
    "What does 'New Hope' mean to you now — a place, a people, or a promise?",
    'If you reach the settlement, who do you want to become there?',
  ],
  10: [
    'Describe how you rest. What does your body need that you cannot give it yet?',
    'Ten days of heat have changed you. What is different about the person writing this?',
    'What stops you from simply lying down and giving in?',
  ],
  11: [
    'This may be your last message before the worst of it. What do you need to say while you still can?',
    "Let yourself imagine it: what would 'home' feel like after all this?",
    'Tomorrow is the peak. What are you carrying into it — supplies, fears, hopes?',
  ],
  12: [
    'You made it. Describe the moment the settlement first comes into view.',
    'Look back across these twelve days. What is the one thing you will never forget?',
    'Who were you when this began — and who are you now?',
  ],
};

export const getDailyPrompts = (day: number): string[] => {
  return dailyPrompts[day] ?? [
    'How did you survive the heat today? Be specific — what you did, what you felt, what nearly broke you.',
    'What kept you human out there?',
    'What do you most want New Hope to know?',
  ];
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
