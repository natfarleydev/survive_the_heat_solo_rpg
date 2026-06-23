import { useState, useEffect } from 'react';
import type { GameState } from './types';
import {
  loadGameState,
  initializeGame,
  resetGame,
  getCurrentLetter,
  isLetterReady,
  getTimeUntilNextLetter,
  formatTimeRemaining,
} from './gameEngine';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import CompletionScreen from './components/CompletionScreen';
import AnimationToggle from './components/AnimationToggle';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const saved = loadGameState();
    setGameState(saved);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!gameState || isLetterReady(gameState)) return;

    const interval = setInterval(() => {
      setGameState((prev) => {
        if (!prev) return null;
        const time = getTimeUntilNextLetter(prev);
        setTimeRemaining(time);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleStartGame = (characterName: string) => {
    const newState = initializeGame(characterName);
    setGameState(newState);
  };

  const handleReset = () => {
    resetGame();
    setGameState(null);
  };

  if (loading) {
    return (
      <>
        <AnimationToggle />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  if (!gameState) {
    return (
      <>
        <AnimationToggle />
        <StartScreen onStartGame={handleStartGame} />
      </>
    );
  }

  if (gameState.gameCompleted) {
    return (
      <>
        <AnimationToggle />
        <CompletionScreen gameState={gameState} onReset={handleReset} />
      </>
    );
  }

  const currentLetter = getCurrentLetter(gameState);
  const letterReady = isLetterReady(gameState);

  return (
    <>
      <AnimationToggle />
      <GameScreen
        gameState={gameState}
        currentLetter={currentLetter}
        letterReady={letterReady}
        formattedTime={formatTimeRemaining(timeRemaining)}
        onGameStateChange={setGameState}
        onReset={handleReset}
      />
    </>
  );
}

export default App;
