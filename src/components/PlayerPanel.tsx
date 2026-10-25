import React from 'react';
import type { GameState, PlayerColor } from '@/lib/ludoGame';

interface PlayerPanelProps {
  gameState: GameState;
  mentionedColors?: PlayerColor[];
}

const colorDot: Record<PlayerColor, string> = {
  red: 'bg-[#FF3B30]',
  blue: 'bg-[#007AFF]',
  yellow: 'bg-[#FF9500]',
  green: 'bg-[#34C759]',
};

const borderActive: Record<PlayerColor, string> = {
  red: 'border-[#FF3B30] shadow-[0_0_16px_rgba(255,59,48,0.35)]',
  blue: 'border-[#007AFF] shadow-[0_0_16px_rgba(0,122,255,0.35)]',
  yellow: 'border-[#FF9500] shadow-[0_0_16px_rgba(255,149,0,0.35)]',
  green: 'border-[#34C759] shadow-[0_0_16px_rgba(52,199,89,0.35)]',
};

export const PlayerPanel: React.FC<PlayerPanelProps> = ({ gameState, mentionedColors = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 select-none">
      {gameState.players.map((player, idx) => {
        const isCurrent = idx === gameState.currentPlayerIndex && gameState.phase !== 'finished';
        const isMentioned = mentionedColors.includes(player.color);
        const tokensGoal = player.tokens.filter(t => t.isGoal).length;

        return (
          <div
            key={player.color}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
              ${isCurrent
                ? `apple-glass bg-white dark:bg-[#272729] scale-105 font-semibold ${borderActive[player.color]}`
                : 'apple-glass bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10 opacity-75 hover:opacity-100'
              }
              ${isMentioned ? 'ring-2 ring-primary ring-offset-1 animate-pulse' : ''}
            `}
          >
            {/* Avatar glyph */}
            <span className="text-[16px] leading-none" title={player.name}>
              {player.avatar}
            </span>

            {/* Name */}
            <span className="text-[13px] text-foreground max-w-[85px] truncate tracking-tight">
              {player.name}
            </span>

            {player.type === 'cpu' && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-md bg-black/10 dark:bg-white/10 text-muted-foreground">
                AI
              </span>
            )}

            {/* Token dots */}
            <div className="flex items-center gap-1 ml-0.5">
              {player.tokens.map(t => (
                <div
                  key={t.id}
                  className={`w-2 h-2 rounded-full transition-all ${
                    t.isGoal
                      ? 'bg-amber-400 scale-110 shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                      : t.isHome
                      ? 'bg-black/15 dark:bg-white/15'
                      : `${colorDot[player.color]} shadow-sm`
                  }`}
                  title={t.isGoal ? 'At Goal' : t.isHome ? 'In Yard' : `Step ${t.position}`}
                />
              ))}
            </div>

            {tokensGoal > 0 && (
              <span className="text-[11px] font-bold text-amber-500 flex items-center">
                {tokensGoal}★
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerPanel;
