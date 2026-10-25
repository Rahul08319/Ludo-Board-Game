import React from 'react';
import type { PlayerColor } from '@/lib/ludoGame';
import { Shield } from 'lucide-react';

interface TokenPieceProps {
  color: PlayerColor;
  isSelectable: boolean;
  isSelected: boolean;
  onClick: () => void;
  small?: boolean;
  isBlockade?: boolean;
  count?: number;
}

// Apple Human Interface System Tints with 8K Optical Material Profiles
const appleColors: Record<PlayerColor, {
  radial: string;
  glow: string;
  accent: string;
  crest: string;
}> = {
  red: {
    radial: 'radial-gradient(circle at 35% 25%, #FF7B72 0%, #FF3B30 45%, #C91D12 85%, #8B0000 100%)',
    glow: '0 0 20px rgba(255, 59, 48, 0.75)',
    accent: '#FF3B30',
    crest: '🦁',
  },
  blue: {
    radial: 'radial-gradient(circle at 35% 25%, #70D7FF 0%, #007AFF 45%, #0051C7 85%, #002D80 100%)',
    glow: '0 0 20px rgba(0, 122, 255, 0.75)',
    accent: '#007AFF',
    crest: '🐲',
  },
  green: {
    radial: 'radial-gradient(circle at 35% 25%, #72F0B0 0%, #34C759 45%, #228B3B 85%, #0E5220 100%)',
    glow: '0 0 20px rgba(52, 199, 89, 0.75)',
    accent: '#34C759',
    crest: '🧙',
  },
  yellow: {
    radial: 'radial-gradient(circle at 35% 25%, #FFE066 0%, #FF9500 45%, #D46B00 85%, #8A3B00 100%)',
    glow: '0 0 20px rgba(255, 149, 0, 0.75)',
    accent: '#FF9500',
    crest: '🦊',
  },
};

export const TokenPiece: React.FC<TokenPieceProps> = ({
  color,
  isSelectable,
  isSelected,
  onClick,
  small = false,
  isBlockade = false,
  count = 1,
}) => {
  const size = small ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-8 h-8 sm:w-10 sm:h-10';
  const c = appleColors[color];

  return (
    <button
      onClick={onClick}
      disabled={!isSelectable}
      className={`
        ${size} rounded-full transition-all duration-200 relative select-none
        apple-press flex items-center justify-center
        ${isSelectable ? 'cursor-pointer animate-apple-hop' : 'cursor-default'}
        ${isSelected ? 'ring-4 ring-[#0071e3] scale-110 shadow-2xl' : ''}
      `}
      style={{
        background: c.radial,
        zIndex: isSelectable ? 30 : 10,
        boxShadow: isSelectable
          ? `0 12px 24px -4px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.25), inset 0 2px 2px rgba(255, 255, 255, 0.95), ${c.glow}`
          : '0 4px 10px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.7)',
        border: isSelectable ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.35)',
      }}
      title={`Token (${color}) ${isSelectable ? '- Click to Advance' : ''} ${isBlockade ? '(Impassable Blockade)' : ''}`}
    >
      {/* 8K High-Gloss Specular Lens Reflection */}
      <div
        className="absolute inset-x-[3px] top-[2px] h-[45%] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
          clipPath: 'ellipse(85% 65% at 50% 35%)',
        }}
      />

      {/* Micro-Beveled Inner Ring */}
      <div className="absolute inset-[3px] rounded-full border border-white/30 pointer-events-none" />

      {/* Optical Precision Core Jewel */}
      <div className="relative z-10 flex items-center justify-center">
        {isBlockade ? (
          <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-black/60 text-white shadow-sm border border-white/60">
            <Shield className="w-2.5 h-2.5 text-amber-300" />
          </div>
        ) : count > 1 ? (
          <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {count}
          </span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/75 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] border border-white/50" />
        )}
      </div>

      {/* Blockade Fortification Ribbon */}
      {isBlockade && (
        <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-amber-500 text-[8px] font-bold text-white shadow-md border border-white/70 leading-tight">
          WALL
        </span>
      )}
    </button>
  );
};

export default TokenPiece;
