# Survive the Heat - Solo RPG

A narrative-driven solo RPG set in a dystopian, heat-ravaged future. You are alone in the wasteland, in contact with a settlement called New Hope via telecom link. Over 12 days, you'll receive letters from the settlement and respond with how you survived each day. Your choices matter—your reports might save lives.

## Features

- **12-day epistolary narrative** with branching story arcs based on your responses
- **Smart prompt generation** that creates meaningful reflection questions based on what you write
- **Persistent game state** stored in localStorage, with markdown export
- **Mobile-first responsive design** with a dust/beige retro-futuristic aesthetic
- **Game stats tracking** that evolves based on your playstyle and responses
- **8-hour letter delays** that simulate async communication and encourage daily returns
- **Fully tested** with comprehensive unit and component tests

## Gameplay

1. **Start Your Journey**: Create a character name
2. **Receive Letters**: The settlement writes to you each day
3. **Respond**: Write about how you survived the heat, what tactics worked, what scared you
4. **AI-Generated Prompts**: Smart questions guide deeper reflection based on your responses
5. **Advance the Story**: After 8 hours, the next letter arrives
6. **Reach New Hope**: Complete all 12 days to reach the settlement

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast bundling and dev server
- **Vitest** + React Testing Library for tests
- **localStorage** for persistence
- **CSS Grid & Flexbox** for responsive layouts
- **GitHub Pages** for deployment

## Development

### Setup
```bash
npm install
npm run dev
```

### Testing
```bash
npm test          # Run tests in watch mode
npm test:ui       # Run tests with UI
```

### Building
```bash
npm run build     # Build for production
npm run deploy    # Build and deploy to GitHub Pages
```

## Game Design Decisions

### Narrative
- **12 letters** tell a cohesive story about a heat wave, survival, and community
- **Character name placeholders** make each playthrough personal
- **Escalating stakes** from day 7 onward (cache mission, peak heat crisis)
- **Emotional resolution** at completion with different epilogues based on settlement morale

### Mechanics
- **8-hour letter delays** encourage daily return visits without requiring constant engagement
- **Keyword-based prompt generation** detects themes (physical, emotional, tactical, relational, moral) and generates contextual questions
- **Stats tracking** that updates based on response content (water preservation, heat tactics, relationships, morale)
- **Tone analysis** (hopeful, desperate, determined, neutral) affects settlement morale
- **localStorage persistence** lets players close the browser and resume later

### Design
- **Light beige/dust palette** evokes a scorched, desiccated landscape
- **Mobile-first responsive** since it's an async game people check frequently
- **Large text, high contrast** for readability during distracted checks
- **Minimal UI** that gets out of the way of the story
- **No external libraries** for NLP—uses simple keyword matching and pattern detection

## Prompts & NLP

The game generates reflection prompts by:

1. **Detecting keywords** in player responses across 5 categories:
   - **Physical**: water, heat, shelter, exhaustion, temperature
   - **Emotional**: scared, hope, lonely, angry, sad
   - **Tactical**: strategy, tested, method, worked, failed
   - **Relational**: people, settlement, Iris, team, help
   - **Moral**: purpose, meaning, sacrifice, duty, belief

2. **Selecting category-specific prompts** from a bank of questions

3. **Adding narrative escalation** tied to the current day (day 11 = peak heat, day 12 = completion)

4. **Analyzing tone** (hopeful/desperate/determined) to adjust settlement morale

This approach is simple, deterministic, and fast—no heavy ML required.

## Data Export

Players can export their entire journey as markdown, including:
- All responses
- Generated prompts
- Final stats
- Settlement morale impact
- Character journey summary

## License

CC-0 (Public Domain) - Use freely for any purpose.

## Credits

Made by [Nas Farley](https://github.com/nasfarley88). Inspired by solo RPG traditions like *Thousand Year Old Vampire*, *Duel of the Magicians*, and epistolary games like *Dust*.

---

**Play at**: https://nasfarley88.github.io/survive_the_heat_solo_rpg/
