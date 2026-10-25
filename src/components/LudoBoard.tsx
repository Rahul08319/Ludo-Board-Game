import React from 'react';
import type { PlayerColor, Token, GameState } from '@/lib/ludoGame';
import { PLAYER_START, toGlobalPosition, SAFE_CELLS } from '@/lib/ludoGame';
import TokenPiece from './TokenPiece';

interface LudoBoardProps {
  gameState: GameState;
  movableTokens: number[];
  onTokenClick: (color: PlayerColor, tokenId: number) => void;
  animatingToken?: { color: PlayerColor; id: number } | null;
}

const TRACK_POSITIONS: [number, number][] = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6],
  [3, 6], [2, 6], [1, 6], [0, 6], [0, 7],
  [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10],
  [6, 11], [6, 12], [6, 13], [6, 14], [7, 14],
  [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8],
  [11, 8], [12, 8], [13, 8], [14, 8], [14, 7],
  [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4],
  [8, 3], [8, 2], [8, 1], [8, 0], [7, 0],
  [6, 0],
];

const HOME_COLUMNS: Record<PlayerColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  blue: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  green: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
};

const HOME_BASES: Record<PlayerColor, [number, number][]> = {
  red: [[2, 2], [2, 4], [4, 2], [4, 4]],
  blue: [[2, 10], [2, 12], [4, 10], [4, 12]],
  green: [[10, 2], [10, 4], [12, 2], [12, 4]],
  yellow: [[10, 10], [10, 12], [12, 10], [12, 12]],
};

// Apple-refined quadrant palettes with subtle glass gradient
const QUADRANT_STYLES: Record<PlayerColor, React.CSSProperties> = {
  red: { background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.22), rgba(255, 59, 48, 0.06))' },
  blue: { background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.22), rgba(0, 122, 255, 0.06))' },
  green: { background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.22), rgba(52, 199, 89, 0.06))' },
  yellow: { background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.22), rgba(255, 149, 0, 0.06))' },
};

const HOME_COL_STYLES: Record<PlayerColor, React.CSSProperties> = {
  red: { background: 'linear-gradient(90deg, rgba(255, 59, 48, 0.45), rgba(255, 59, 48, 0.18))' },
  blue: { background: 'linear-gradient(180deg, rgba(0, 122, 255, 0.45), rgba(0, 122, 255, 0.18))' },
  green: { background: 'linear-gradient(0deg, rgba(52, 199, 89, 0.45), rgba(52, 199, 89, 0.18))' },
  yellow: { background: 'linear-gradient(270deg, rgba(255, 149, 0, 0.45), rgba(255, 149, 0, 0.18))' },
};

const START_STYLES: Record<PlayerColor, React.CSSProperties> = {
  red: { background: 'rgba(255, 59, 48, 0.4)' },
  blue: { background: 'rgba(0, 122, 255, 0.4)' },
  green: { background: 'rgba(52, 199, 89, 0.4)' },
  yellow: { background: 'rgba(255, 149, 0, 0.4)' },
};

function getTokensAtPosition(state: GameState, globalPos: number): { token: Token; color: PlayerColor }[] {
  const result: { token: Token; color: PlayerColor }[] = [];
  for (const player of state.players) {
    for (const token of player.tokens) {
      if (!token.isHome && !token.isGoal && token.position < 52) {
        if (toGlobalPosition(token.position, player.color) === globalPos) {
          result.push({ token, color: player.color });
        }
      }
    }
  }
  return result;
}

function getTokensInHomeColumn(state: GameState, color: PlayerColor, colIndex: number): Token[] {
  const player = state.players.find(p => p.color === color);
  if (!player) return [];
  return player.tokens.filter(t => !t.isHome && !t.isGoal && t.position === 52 + colIndex);
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  gameState,
  movableTokens,
  onTokenClick,
  animatingToken,
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const isInQuadrant = (row: number, col: number): PlayerColor | null => {
    if (row <= 5 && col <= 5) return 'red';
    if (row <= 5 && col >= 9) return 'blue';
    if (row >= 9 && col <= 5) return 'green';
    if (row >= 9 && col >= 9) return 'yellow';
    return null;
  };

  const isHomeColumn = (row: number, col: number): PlayerColor | null => {
    for (const [color, positions] of Object.entries(HOME_COLUMNS) as [PlayerColor, [number, number][]][]) {
      if (positions.some(([r, c]) => r === row && c === col)) return color;
    }
    return null;
  };

  const getTrackIndex = (row: number, col: number): number => {
    return TRACK_POSITIONS.findIndex(([r, c]) => r === row && c === col);
  };

  const isSafeCell = (trackIdx: number) => SAFE_CELLS.includes(trackIdx);
  const isStartCell = (trackIdx: number) => Object.values(PLAYER_START).includes(trackIdx);
  const isCenter = (row: number, col: number) => row === 7 && col === 7;

  const renderCell = (row: number, col: number) => {
    const quadrant = isInQuadrant(row, col);
    const homeCol = isHomeColumn(row, col);
    const trackIdx = getTrackIndex(row, col);
    const center = isCenter(row, col);

    let cellTokens: { token: Token; color: PlayerColor; isMovable: boolean; isAnimating: boolean }[] = [];

    if (trackIdx >= 0) {
      const tokensHere = getTokensAtPosition(gameState, trackIdx);
      cellTokens = tokensHere.map(({ token, color }) => ({
        token,
        color,
        isMovable: color === currentPlayer?.color && movableTokens.includes(token.id),
        isAnimating: animatingToken?.color === color && animatingToken?.id === token.id,
      }));
    }

    if (homeCol) {
      const colIndex = HOME_COLUMNS[homeCol].findIndex(([r, c]) => r === row && c === col);
      const tokens = getTokensInHomeColumn(gameState, homeCol, colIndex);
      cellTokens = tokens.map(t => ({
        token: t,
        color: homeCol,
        isMovable: homeCol === currentPlayer?.color && movableTokens.includes(t.id),
        isAnimating: animatingToken?.color === homeCol && animatingToken?.id === t.id,
      }));
    }

    let homeBaseToken: { token: Token; color: PlayerColor; isMovable: boolean; isAnimating: boolean } | null = null;
    for (const [color, positions] of Object.entries(HOME_BASES) as [PlayerColor, [number, number][]][]) {
      const baseIdx = positions.findIndex(([r, c]) => r === row && c === col);
      if (baseIdx >= 0) {
        const player = gameState.players.find(p => p.color === color);
        if (player) {
          const homeTokens = player.tokens.filter(t => t.isHome);
          if (homeTokens[0] && baseIdx < homeTokens.length) {
            homeBaseToken = {
              token: homeTokens[baseIdx],
              color,
              isMovable: color === currentPlayer?.color && movableTokens.includes(homeTokens[baseIdx].id),
              isAnimating: animatingToken?.color === color && animatingToken?.id === homeTokens[baseIdx].id,
            };
          }
        }
      }
    }

    // Check for Impassable Wall (Blockade from 2008 J2ME ANYPLAYS rules)
    const isBlockade = trackIdx >= 0 && cellTokens.length >= 2 && cellTokens.every(ct => ct.color === cellTokens[0].color);

    // Style determination
    let cellStyle: React.CSSProperties = {};
    let extraClasses = '';

    if (center) {
      cellStyle = {
        background: `
          conic-gradient(
            from 45deg,
            rgba(255, 59, 48, 0.95),
            rgba(0, 122, 255, 0.95),
            rgba(255, 149, 0, 0.95),
            rgba(52, 199, 89, 0.95),
            rgba(255, 59, 48, 0.95)
          )
        `,
      };
    } else if (homeCol) {
      cellStyle = HOME_COL_STYLES[homeCol];
    } else if (trackIdx >= 0 && isStartCell(trackIdx)) {
      const startColor = (Object.entries(PLAYER_START) as [PlayerColor, number][]).find(([_, pos]) => pos === trackIdx)?.[0];
      if (startColor) cellStyle = START_STYLES[startColor];
    } else if (trackIdx >= 0) {
      cellStyle = { background: 'hsl(var(--board-cell))' };
    } else if (quadrant && !Object.values(HOME_BASES).flat().some(([r, c]) => r === row && c === col)) {
      cellStyle = QUADRANT_STYLES[quadrant];
      const isCurrentPlayerQuad = currentPlayer?.color === quadrant;
      return (
        <div
          key={`${row}-${col}`}
          className={`border border-black/5 dark:border-white/5 transition-all duration-300 ${
            isCurrentPlayerQuad ? 'bg-black/5 dark:bg-white/5' : ''
          }`}
          style={cellStyle}
        />
      );
    } else {
      cellStyle = { background: 'hsl(var(--board-cell))' };
    }

    if (trackIdx >= 0 && isSafeCell(trackIdx)) {
      extraClasses = 'ring-1 ring-inset ring-amber-500/50 bg-amber-500/10 shadow-[inset_0_0_8px_rgba(251,191,36,0.15)]';
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`border border-black/8 dark:border-white/10 flex items-center justify-center relative transition-colors duration-200 select-none ${extraClasses}`}
        style={cellStyle}
      >
        {homeBaseToken && (
          <div className={homeBaseToken.isAnimating ? 'animate-bounce' : ''}>
            <TokenPiece
              color={homeBaseToken.color}
              isSelectable={homeBaseToken.isMovable}
              isSelected={false}
              onClick={() => onTokenClick(homeBaseToken!.color, homeBaseToken!.token.id)}
              small
            />
          </div>
        )}

        {cellTokens.map(({ token, color, isMovable, isAnimating }, i) => (
          <div
            key={`${color}-${token.id}`}
            className={`absolute ${isAnimating ? 'animate-bounce' : ''}`}
            style={{ transform: `translate(${i * 4}px, ${i * -4}px)` }}
          >
            <TokenPiece
              color={color}
              isSelectable={isMovable}
              isSelected={false}
              onClick={() => onTokenClick(color, token.id)}
              small
              isBlockade={isBlockade}
              count={cellTokens.length}
            />
          </div>
        ))}

        {center && (
          <div
            className="w-7 h-7 rounded-full border-2 border-white/80 shadow-lg flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffffff 10%, #ffd700 70%, #d4af37 100%)',
              boxShadow: '0 0 16px rgba(255, 215, 0, 0.75)',
            }}
          >
            <span className="text-[12px] leading-none drop-shadow-sm">🏆</span>
          </div>
        )}

        {trackIdx >= 0 && isSafeCell(trackIdx) && cellTokens.length === 0 && !homeBaseToken && (
          <span className="text-[11px] text-amber-500 font-bold opacity-90 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]">
            ★
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-[min(72vh,520px)] aspect-square mx-auto p-2 sm:p-3 apple-chassis-8k rounded-[34px]">
      {/* Museum-Grade Apple Squircle Chassis with Precision Machined Bevel */}
      <div
        className="w-full h-full rounded-[26px] overflow-hidden border border-black/10 dark:border-white/15 apple-elevation transition-all duration-300"
        style={{
          background: 'hsl(var(--board-bg))',
        }}
      >
        <div className="w-full h-full grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(15,1fr)]">
          {Array.from({ length: 15 }, (_, row) =>
            Array.from({ length: 15 }, (_, col) => renderCell(row, col))
          )}
        </div>
      </div>
    </div>
  );
};

export default LudoBoard;
