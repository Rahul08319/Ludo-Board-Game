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
        relative w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white dark:bg-[#2c2c2e]
        border border-black/10 dark:border-white/15
        transition-all duration-200 select-none apple-press
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-apple-glass'}
        ${isRolling ? 'animate-bounce' : ''}
      `}
      style={{
        boxShadow: isRolling
          ? '0 16px 36px rgba(0, 0, 0, 0.28), inset 0 2px 3px rgba(255, 255, 255, 0.9)'
          : '0 8px 24px rgba(0, 0, 0, 0.14), inset 0 1.5px 2px rgba(255, 255, 255, 0.8)',
      }}
      title={disabled ? 'Wait for your turn' : 'Roll the dice'}
    >
      {/* Specular surface highlight */}
      <div className="absolute inset-x-2 top-1.5 h-6 rounded-t-[16px] bg-gradient-to-b from-white/60 to-transparent dark:from-white/15 pointer-events-none" />

      {/* Die Faces */}
      <svg viewBox="0 0 100 100" className="w-full h-full p-2.5">
        <defs>
          <radialGradient id="pipGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1d1d1f" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>
        {dots.map(([cx, cy], i) => (
          <g key={i}>
            {/* Pip recessed shadow */}
            <circle cx={cx} cy={cy + 1} r={8.5} fill="rgba(0,0,0,0.2)" />
            {/* Pip dot */}
            <circle
              cx={cx}
              cy={cy}
              r={8}
              className="fill-[#1d1d1f] dark:fill-white transition-all"
            />
          </g>
        ))}
      </svg>

      {!value && !isRolling && (
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-muted-foreground tracking-tight">
          Roll
        </span>
      )}
    </button>
  );
};

export default Dice;
