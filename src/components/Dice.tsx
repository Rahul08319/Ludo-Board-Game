import React from 'react';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onClick: () => void;
  disabled: boolean;
}

const dotPositions: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
};

export const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, disabled }) => {
  const dots = value ? dotPositions[value] : [];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] dice-ivory-8k
        transition-all duration-200 select-none apple-press
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${isRolling ? 'animate-apple-dice-3d pointer-events-none' : ''}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
      title={disabled ? 'Wait for your turn' : 'Roll the 3D dice'}
    >
      {/* 8K Top-edge Specular Highlight Bevel */}
      <div className="absolute inset-x-2 top-1.5 h-6 rounded-t-[18px] bg-gradient-to-b from-white/80 to-transparent dark:from-white/20 pointer-events-none" />

      {/* Recessed Pip Grid with Deep Contact Shadows */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-2.5 relative z-10">
        <defs>
          <radialGradient id="pipGloss" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#3a3a3c" />
            <stop offset="60%" stopColor="#1d1d1f" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="pipGlossDark" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f5f5f7" />
            <stop offset="100%" stopColor="#d2d2d7" />
          </radialGradient>
          <filter id="pipInsetShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>
        {dots.map(([cx, cy], i) => (
          <g key={i}>
            {/* Pip recessed cavity shadow */}
            <circle cx={cx} cy={cy + 1.2} r={9} fill="rgba(0,0,0,0.25)" />
            {/* Pip lacquer enamel body */}
            <circle
              cx={cx}
              cy={cy}
              r={8.2}
              className="fill-[url(#pipGloss)] dark:fill-[url(#pipGlossDark)]"
              filter="url(#pipInsetShadow)"
            />
            {/* Pip specular sheen */}
            <circle cx={cx - 2.5} cy={cy - 2.5} r={2.2} fill="rgba(255,255,255,0.7)" />
          </g>
        ))}
      </svg>

      {!value && !isRolling && (
        <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#0066cc] dark:text-[#2997ff] tracking-tight">
          Roll 🎲
        </span>
      )}

      {/* Rolling kinetic blur aura */}
      {isRolling && (
        <div className="absolute inset-0 rounded-[24px] bg-[#0066cc]/10 dark:bg-[#2997ff]/15 animate-ping pointer-events-none" />
      )}
    </button>
  );
};

export default Dice;
