import React from 'react';
import type { PlayerColor } from '@/lib/ludoGame';

interface TokenPieceProps {
  color: PlayerColor;
  isSelectable: boolean;
  isSelected: boolean;
  onClick: () => void;
  small?: boolean;
}

// Apple Human Interface System Tints
const appleColors: Record<PlayerColor, {
  gradient: string;
  glow: string;
  border: string;
}> = {
  red: {
    gradient: 'from-[#FF6961] via-[#FF3B30] to-[#D70015]',
    glow: '0 0 14px rgba(255, 59, 48, 0.65)',
    border: 'border-white/40',
  },
  blue: {
    gradient: 'from-[#64D2FF] via-[#007AFF] to-[#0040DD]',
    glow: '0 0 14px rgba(0, 122, 255, 0.65)',
    border: 'border-white/40',
  },
  green: {
    gradient: 'from-[#63E6E2] via-[#34C759] to-[#248A3D]',
    glow: '0 0 14px rgba(52, 199, 89, 0.65)',
    border: 'border-white/40',
  },
  yellow: {
    gradient: 'from-[#FFD60A] via-[#FF9500] to-[#C93400]',
    glow: '0 0 14px rgba(255, 149, 0, 0.65)',
    border: 'border-white/40',
  },
};

export const TokenPiece: React.FC<TokenPieceProps> = ({
  color,
  isSelectable,
  isSelected,
  onClick,
  small = false,
}) => {
  const size = small ? 'w-6 h-6' : 'w-8 h-8 sm:w-9 sm:h-9';
  const c = appleColors[color];

  return (
    <button
      onClick={onClick}
      disabled={!isSelectable}
      className={`
        ${size} rounded-full bg-gradient-to-b ${c.gradient}
        border transition-all duration-200 relative select-none
        apple-press
        ${isSelectable ? 'cursor-pointer animate-apple-hop' : 'cursor-default'}
        ${isSelected ? 'ring-3 ring-[#0071e3] scale-110 shadow-lg' : ''}
        ${isSelectable ? 'border-white/80' : 'border-black/20 dark:border-white/20'}
      `}
      style={{
        zIndex: isSelectable ? 25 : 10,
        boxShadow: isSelectable
          ? `0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 0.8), ${c.glow}`
          : '0 3px 8px rgba(0, 0, 0, 0.25), inset 0 1px 1.5px rgba(255, 255, 255, 0.5)',
      }}
      title={`Token (${color}) ${isSelectable ? '- Click to Move' : ''}`}
    >
      {/* Upper Specular Glass Sheen */}
      <div className="absolute inset-x-[3px] top-[2px] h-[40%] rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

      {/* Subtle Inner Ring */}
      <div className="absolute inset-[3px] rounded-full border border-white/25 pointer-events-none" />

      {/* Concentric Precision Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50 shadow-inner" />
    </button>
  );
};

export default TokenPiece;
