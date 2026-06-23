import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartScreen from './StartScreen';

describe('StartScreen', () => {
  it('renders title and intro text', () => {
    const mockStartGame = vi.fn();
    render(<StartScreen onStartGame={mockStartGame} />);
    expect(screen.getByText('Survive the Heat')).toBeInTheDocument();
    expect(screen.getByText('A Solo RPG in a Burning Future')).toBeInTheDocument();
  });

  it('has character name input field', () => {
    const mockStartGame = vi.fn();
    render(<StartScreen onStartGame={mockStartGame} />);
    const input = screen.getByPlaceholderText(/enter your character/i);
    expect(input).toBeInTheDocument();
  });

  it('starts game with character name', async () => {
    const mockStartGame = vi.fn();
    const user = userEvent.setup();
    render(<StartScreen onStartGame={mockStartGame} />);

    const input = screen.getByPlaceholderText(/enter your character/i);
    await user.type(input, 'Hero');

    const button = screen.getByRole('button', { name: /begin your journey/i });
    await user.click(button);

    expect(mockStartGame).toHaveBeenCalledWith('Hero');
  });

  it('disables submit button when name is empty', () => {
    const mockStartGame = vi.fn();
    render(<StartScreen onStartGame={mockStartGame} />);
    const button = screen.getByRole('button', { name: /begin your journey/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when name is entered', async () => {
    const mockStartGame = vi.fn();
    const user = userEvent.setup();
    render(<StartScreen onStartGame={mockStartGame} />);

    const input = screen.getByPlaceholderText(/enter your character/i);
    await user.type(input, 'X');

    const button = screen.getByRole('button', { name: /begin your journey/i });
    expect(button).not.toBeDisabled();
  });

  it('trims whitespace from character name', async () => {
    const mockStartGame = vi.fn();
    const user = userEvent.setup();
    render(<StartScreen onStartGame={mockStartGame} />);

    const input = screen.getByPlaceholderText(/enter your character/i) as HTMLInputElement;
    await user.type(input, '  Hero  ');

    const button = screen.getByRole('button', { name: /begin your journey/i });
    await user.click(button);

    expect(mockStartGame).toHaveBeenCalledWith('Hero');
  });

  it('shows warning about content', () => {
    const mockStartGame = vi.fn();
    render(<StartScreen onStartGame={mockStartGame} />);
    expect(screen.getByText(/content warning/i)).toBeInTheDocument();
  });
});
