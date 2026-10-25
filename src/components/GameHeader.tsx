import React from 'react';
import { Volume2, VolumeX, Moon, Sun, BookOpen, Clock, RotateCcw, Github } from 'lucide-react';
import type { AppTheme } from '@/components/AppleGlobalNav';

interface GameHeaderProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onToggleHistory: () => void;
  onNewGame: () => void;
  isPlaying: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentTheme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onToggleHistory,
  onNewGame,
  isPlaying,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full h-[52px] apple-glass border-b border-black/8 dark:border-white/10 select-none">
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Game Title */}
        <div className="flex items-center gap-2">
          <span className="text-[20px] font-semibold tracking-tight text-foreground">
            Ludo & Friends
          </span>
        </div>

        {/* Right: In-Game HUD Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rules */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            title="Game Rules"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Turn Log (when game is active) */}
          {isPlaying && (
            <button
              onClick={onToggleHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
              title="Turn Log"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log</span>
            </button>
          )}

          {/* Theme Switcher */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-full p-0.5 border border-black/5 dark:border-white/10">
            <button
              onClick={() => onThemeChange(currentTheme === 'studio' ? 'ceramic' : currentTheme === 'ceramic' ? 'oled' : currentTheme === 'oled' ? 'wood' : 'studio')}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium text-foreground/90 hover:text-foreground transition-colors flex items-center gap-1"
              title={`Board Theme: ${currentTheme.toUpperCase()} (Click to Cycle)`}
            >
              {currentTheme === 'ceramic' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="hidden md:inline text-[10px]">Ceramic</span>
                </>
              ) : currentTheme === 'oled' ? (
                <>
                  <Moon className="w-3 h-3 text-purple-400" />
                  <span className="hidden md:inline text-[10px]">OLED</span>
                </>
              ) : currentTheme === 'wood' ? (
                <>
                  <span className="text-[10px]">🪵</span>
                  <span className="hidden md:inline text-[10px]">Wood</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span className="hidden md:inline text-[10px]">Studio</span>
                </>
              )}
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-all apple-press"
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>

          {/* New Game / Reset Button */}
          {isPlaying && (
            <button
              onClick={onNewGame}
              className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center gap-1.5 text-[13px] py-1.5 px-3.5"
              title="Return to Setup / New Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Game</span>
            </button>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com/Rahul08319/Ludo-Board-Game"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-all apple-press"
            title="View on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
