import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartScreen from './StartScreen';

describe('StartScreen', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // The screen opens with an ~18s narrative splash, then reveals the input
  // phase, then reveals the context text 600ms later. We use fake timers to
  // jump past the splash, then switch back to real timers so userEvent typing
  // behaves normally (userEvent + fake timers is prone to hanging).
  const renderPastSplash = (onStartGame = vi.fn()) => {
    vi.useFakeTimers();
    render(<StartScreen onStartGame={onStartGame} />);
    act(() => {
      vi.advanceTimersByTime(18000);
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    vi.useRealTimers();
    return onStartGame;
  };

  it('renders the title and hook after the splash', () => {
    renderPastSplash();
    expect(screen.getByText('Survive the Heat')).toBeInTheDocument();
    expect(screen.getByText(/found your signal/i)).toBeInTheDocument();
  });

  it('has a character name input field', () => {
    renderPastSplash();
    expect(screen.getByPlaceholderText('Your name...')).toBeInTheDocument();
  });

  it('starts the game with the character name', async () => {
    const mockStartGame = renderPastSplash();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Your name...'), 'Hero');
    await user.click(screen.getByRole('button', { name: /start your journey/i }));

    expect(mockStartGame).toHaveBeenCalledWith('Hero');
  });

  it('disables the submit button when the name is empty', () => {
    renderPastSplash();
    expect(screen.getByRole('button', { name: /start your journey/i })).toBeDisabled();
  });

  it('enables the submit button when a name is entered', async () => {
    renderPastSplash();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Your name...'), 'X');
    expect(screen.getByRole('button', { name: /start your journey/i })).not.toBeDisabled();
  });

  it('trims whitespace from the character name', async () => {
    const mockStartGame = renderPastSplash();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('Your name...'), '  Hero  ');
    await user.click(screen.getByRole('button', { name: /start your journey/i }));

    expect(mockStartGame).toHaveBeenCalledWith('Hero');
  });

  it('shows the content/themes notice', () => {
    renderPastSplash();
    expect(screen.getByText(/themes: heat stress/i)).toBeInTheDocument();
  });
});
