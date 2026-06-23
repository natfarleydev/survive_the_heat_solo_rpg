# Survive the Heat — Solo RPG

> A narrative-driven solo RPG set in a dystopian, heat-ravaged future. You are alone in the wasteland, in contact with a settlement called New Hope via telecom link. Over 12 days, you'll receive letters and respond with how you survived the heat. Your choices matter—your reports might save lives.

**▶️ [Play Now](https://natfarleydev.github.io/survive_the_heat_solo_rpg/)**

## Overview

Survive the Heat is an epistolary solo RPG that runs entirely in your browser. Each day (real-time or simulated), you receive a letter from the settlement. You respond with how you survived the heat—and the game listens.

The game uses **smart keyword detection** to generate contextual reflection prompts based on what you write. Your tone and tactics affect the settlement's morale. Everything saves to localStorage, so you can close the browser and return when the next letter arrives (in 8 hours, or instantly if you fast-forward the timer).

It's designed for **daily play** over 12 days, but you can complete it in an afternoon if you want.

## ⚡ Quick Start

1. Go to **[natfarleydev.github.io/survive_the_heat_solo_rpg](https://natfarleydev.github.io/survive_the_heat_solo_rpg/)**
2. Enter your character's name
3. Read the first letter from Iris
4. Write your response (how you survived day 1)
5. Wait 8 hours for the next letter (or skip ahead for testing)
6. Repeat for 12 days until you reach New Hope

## 🎮 Features

- **12-day epistolary narrative** — letters tell a cohesive story about a heat crisis, survival, and community
- **Smart prompt generation** — AI-like keyword detection generates contextual reflection questions
- **Game stats** — track heat tactics discovered, relationships formed, water preserved, settlement morale
- **Persistent saves** — localStorage keeps your progress across browser restarts
- **Markdown export** — download your entire journey as a formatted document
- **8-hour delays** — encourage daily returns without grinding
- **Mobile-first design** — responsive, readable on any device
- **Fully tested** — 52 passing tests (Vitest + React Testing Library)
- **Lightweight** — 223KB JS, 14KB CSS gzipped

## 📖 The Story

You've been picked up by a settlement called **New Hope**—holed up in an old data center 200+ klicks away. They found your signal in the wasteland. Now they want to know: how do you survive the heat?

Over 12 days:
- **Days 1–4**: The settlement introduces itself; you prove your survival skills
- **Days 5–7**: A heat spike hits; tensions rise; you're asked to find a supply cache
- **Days 8–11**: The worst heat of the year; you're pushed to your limits
- **Day 12**: You either reach New Hope or face the aftermath

Each letter is from a different settlement member—Iris (comms), Dr. Venn (medic), Koss (scavenger), Mara (psychologist), Sato (engineer). They each respond to what you've written.

## 🧠 Prompts & NLP

The game doesn't use heavy ML—just smart keyword detection:

**Keyword Categories:**
- **Physical**: water, heat, cold, shelter, exhaustion, temperature
- **Emotional**: scared, hope, lonely, angry, love, despair
- **Tactical**: strategy, tested, method, worked, failed
- **Relational**: people, settlement, Iris, team, connection
- **Moral**: purpose, meaning, sacrifice, duty, belief

When you submit a response, the game:
1. Detects which categories you touched
2. Picks a relevant reflection prompt from each
3. Analyzes your tone (hopeful, desperate, determined, neutral)
4. Adjusts settlement morale based on tone
5. Shows you the prompts alongside your journey log

It's deterministic, fast, and transparent—no black-box AI.

## 💾 Data & Export

All game state lives in **localStorage**:
- Your character name
- All 12 letters
- All your responses
- Generated prompts
- Stats (morale, water, tactics, relationships)
- Timestamps

**Export as Markdown**: Download your entire journey as a `.md` file. Share your story, archive it, convert it to PDF—it's yours.

**No cloud sync**: Everything stays on your device. No tracking, no accounts, no API calls.

## 🏗️ Tech Stack

| Component | Tech |
|-----------|------|
| Framework | React 19 + TypeScript |
| Build | Vite (dev + prod) |
| Testing | Vitest + React Testing Library |
| Styling | CSS Grid/Flexbox, CSS variables |
| Persistence | localStorage |
| Deployment | GitHub Pages |
| License | CC-0 (public domain) |

**Bundle Size:**
- HTML: 0.55 KB
- CSS: 14.73 KB (2.89 KB gzipped)
- JS: 223.41 KB (71.18 KB gzipped)

## 🚀 Development

### Setup
```bash
git clone https://github.com/natfarleydev/survive_the_heat_solo_rpg.git
cd survive_the_heat_solo_rpg
npm install
npm run dev
```

Then visit `http://localhost:5173/survive_the_heat_solo_rpg/`.

### Testing
```bash
npm test          # Run tests in watch mode
npm test:ui       # Run tests with interactive UI
```

**Test coverage:**
- Game engine (state, persistence, letter logic): 18 tests
- Prompt generator (keyword detection, tone, escalation): 25 tests
- Components (StartScreen, forms, display): 7 tests
- Integration (full game flow): 2 tests

### Building & Deployment

```bash
npm run build     # Build to dist/
npm run deploy    # Build + push to GitHub Pages
```

The deploy script uses `gh-pages` to publish the `dist/` folder to the `gh-pages` branch, which GitHub serves at the configured URL.

## 📂 Project Structure

```
src/
├── types.ts                    # TypeScript interfaces
├── letterBank.ts              # 12 letters with [NAME] placeholders
├── promptGenerator.ts         # Keyword detection, tone analysis
├── gameEngine.ts              # State, persistence, logic
├── App.tsx                    # Main app container
├── App.css                    # All styling (mobile-first)
├── components/
│   ├── StartScreen.tsx        # Character creation
│   ├── GameScreen.tsx         # Main gameplay view
│   ├── LetterDisplay.tsx      # Renders current letter
│   ├── ResponseForm.tsx       # Text input + submit
│   ├── StatsPanel.tsx         # Settlement morale, stats
│   ├── HistoryPanel.tsx       # View past responses
│   ├── CompletionScreen.tsx   # End-of-game epilogue
│   └── *.test.tsx             # Component tests
├── gameEngine.test.ts         # Game logic tests
├── promptGenerator.test.ts    # Prompt logic tests
└── test-setup.ts              # Testing library matchers
```

## 🎨 Design

**Aesthetic**: 1990s sci-fi meets Mad Max—dusty, desiccated, retro.

**Color Palette**:
- Dust beige (`#d4c4b0`)
- Dark sand (`#4a3f2f`)
- Accent heat (`#d84c3a`)
- Accent hope (`#b8a657`)
- Accent cool (`#5a8f7b`)

**Typography**: Georgia serif for body text (evokes letters). Courier for game state.

**Responsive**: Mobile-first. Grid adjusts from 1 column (mobile) → 2 columns (tablet) → full sidebar (desktop).

## 🎲 Game Design Philosophy

**Async gameplay**: Unlike traditional RPGs, you're not expected to binge Survive the Heat. Letters arrive every 8 hours. This creates a rhythm: check-in daily, see what the settlement says, write a response, come back tomorrow.

**Narrative through reflection**: The game doesn't impose a "correct" way to survive. It asks questions and listens to your answers. Your tone, your tactics, your fears all feed back into the story.

**No grinding, no failure states**: You can't lose. The worst thing that happens is your morale drops, but you still reach the settlement. The point is reflection, not optimization.

**Portable story**: Export your journey as markdown. It's a record of how *you* survived those 12 days. Share it, keep it, forget it—it's yours.

## 📜 License

**CC-0 (Public Domain)**. Use for anything: educational, commercial, remix, fork, print it out. No attribution required (but appreciated).

See the [LICENSE](./LICENSE) file (it's just a note).

## 🙏 Credits

**Made by**: [Nas Farley](https://github.com/nasfarley88)

**Inspired by**:
- *Thousand Year Old Vampire* (epistolary solo RPG by Widge Juarrero)
- *Duel of the Magicians* (lightweight, prompt-driven)
- *Dust* (atmospheric, choice-driven narrative game)
- Mad Max and 90s sci-fi aesthetics

**Tool stack**: React, Vite, TypeScript, Vitest, GitHub Pages

---

**Play at**: [natfarleydev.github.io/survive_the_heat_solo_rpg](https://natfarleydev.github.io/survive_the_heat_solo_rpg/)

Questions? Open an issue on GitHub.
