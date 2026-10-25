import React, { useState } from 'react';
import type { PlayerColor, PlayerType, CpuDifficulty } from '@/lib/ludoGame';
import { PLAYER_COLORS } from '@/lib/ludoGame';
import Leaderboard from '@/components/Leaderboard';
import { Play, Sparkles, Globe, Trophy, Info } from 'lucide-react';

interface PlayerConfig {
  color: PlayerColor;
  type: PlayerType;
  name: string;
  avatar: string;
  difficulty: CpuDifficulty;
}

interface GameSetupProps {
  onStart: (configs: PlayerConfig[]) => void;
  onOnlineClick?: () => void;
  onOpenHeritage?: () => void;
}

// Authentic Avatars including J2ME 2008 Classic Heritage characters
const AVATARS = [
  '🦁', // Paladin (Classic J2ME Red)
  '🐲', // Knight (Classic J2ME Blue)
  '🧙', // Wizard (Classic J2ME Green)
  '🦊', // Orc (Classic J2ME Yellow)
  '👤', '🐯', '🐻', '🐼', '🦅', '👑', '⚔️', '🛡️'
];

const colorLabels: Record<PlayerColor, string> = {
  red: 'Red (Paladin)',
  blue: 'Blue (Knight)',
  yellow: 'Yellow (Orc)',
  green: 'Green (Wizard)',
};

const defaultAvatars: Record<PlayerColor, string> = {
  red: '🦁',
  blue: '🐲',
  yellow: '🦊',
  green: '🧙',
};

const colorBorder: Record<PlayerColor, string> = {
  red: 'focus-within:border-[#FF3B30] border-[#FF3B30]/30',
  blue: 'focus-within:border-[#007AFF] border-[#007AFF]/30',
  yellow: 'focus-within:border-[#FF9500] border-[#FF9500]/30',
  green: 'focus-within:border-[#34C759] border-[#34C759]/30',
};

const colorDot: Record<PlayerColor, string> = {
  red: 'bg-[#FF3B30]',
  blue: 'bg-[#007AFF]',
  yellow: 'bg-[#FF9500]',
  green: 'bg-[#34C759]',
};

export const GameSetup: React.FC<GameSetupProps> = ({
  onStart,
  onOnlineClick,
  onOpenHeritage,
}) => {
  const [configs, setConfigs] = useState<Record<PlayerColor, { type: PlayerType; name: string; avatar: string; difficulty: CpuDifficulty }>>({
    red: { type: 'human', name: '', avatar: defaultAvatars.red, difficulty: 'medium' },
    blue: { type: 'cpu', name: '', avatar: defaultAvatars.blue, difficulty: 'medium' },
    yellow: { type: 'empty', name: '', avatar: defaultAvatars.yellow, difficulty: 'medium' },
    green: { type: 'empty', name: '', avatar: defaultAvatars.green, difficulty: 'medium' },
  });

  const [editingAvatar, setEditingAvatar] = useState<PlayerColor | null>(null);

  const setType = (color: PlayerColor, type: PlayerType) => {
    setConfigs(prev => ({ ...prev, [color]: { ...prev[color], type } }));
  };

  const setName = (color: PlayerColor, name: string) => {
    setConfigs(prev => ({ ...prev, [color]: { ...prev[color], name } }));
  };

  const setAvatar = (color: PlayerColor, avatar: string) => {
    setConfigs(prev => ({ ...prev, [color]: { ...prev[color], avatar } }));
    setEditingAvatar(null);
  };

  const setDifficulty = (color: PlayerColor, difficulty: CpuDifficulty) => {
    setConfigs(prev => ({ ...prev, [color]: { ...prev[color], difficulty } }));
  };

  const activePlayers = Object.values(configs).filter(t => t.type !== 'empty').length;

  const handleStart = () => {
    onStart(PLAYER_COLORS.map(c => ({
      color: c,
      type: configs[c].type,
      name: configs[c].name.trim() || colorLabels[c].split(' ')[0],
      avatar: configs[c].avatar,
      difficulty: configs[c].difficulty,
    })));
  };

  const handleDemo = () => {
    onStart(PLAYER_COLORS.map(c => ({
      color: c,
      type: 'cpu' as PlayerType,
      name: colorLabels[c].split(' ')[0],
      avatar: defaultAvatars[c],
      difficulty: 'hard' as CpuDifficulty,
    })));
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation select-none animate-apple-spring">
      {/* Header */}
      <div className="text-center space-y-1 mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Ludo & Friends
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Configure player roster, choose your avatars, and start your match.
        </p>
      </div>

      {/* Players Setup List */}
      <div className="space-y-3 mb-6">
        {PLAYER_COLORS.map(color => {
          const cfg = configs[color];
          const isOff = cfg.type === 'empty';

          return (
            <div
              key={color}
              className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                isOff
                  ? 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'
                  : `bg-white/60 dark:bg-white/5 ${colorBorder[color]} shadow-sm`
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Avatar + Color Indicator + Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar Picker Button */}
                  <button
                    onClick={() => setEditingAvatar(color)}
                    disabled={isOff}
                    className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition-transform shrink-0"
                    title="Change Avatar"
                  >
                    {cfg.avatar}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorDot[color]} shrink-0`} />
                      <span className="text-[14px] font-semibold text-foreground tracking-tight truncate">
                        {colorLabels[color]}
                      </span>
                    </div>

                    {!isOff && (
                      <input
                        type="text"
                        value={cfg.name}
                        onChange={e => setName(color, e.target.value)}
                        placeholder={`Name (${colorLabels[color].split(' ')[0]})`}
                        maxLength={12}
                        className="text-[12px] bg-transparent text-foreground placeholder:text-muted-foreground/60 border-b border-black/10 dark:border-white/15 focus:outline-none focus:border-[#0066cc] w-28 sm:w-36 mt-0.5"
                      />
                    )}
                  </div>
                </div>

                {/* Right: Mode Selector Pills */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex bg-black/5 dark:bg-white/10 rounded-full p-0.5 text-[12px]">
                    <button
                      onClick={() => setType(color, 'human')}
                      className={`px-2.5 py-1 rounded-full transition-all apple-press ${
                        cfg.type === 'human'
                          ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Human
                    </button>
                    <button
                      onClick={() => setType(color, 'cpu')}
                      className={`px-2.5 py-1 rounded-full transition-all apple-press ${
                        cfg.type === 'cpu'
                          ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      AI
                    </button>
                    <button
                      onClick={() => setType(color, 'empty')}
                      className={`px-2.5 py-1 rounded-full transition-all apple-press ${
                        cfg.type === 'empty'
                          ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Off
                    </button>
                  </div>

                  {cfg.type === 'cpu' && (
                    <select
                      value={cfg.difficulty}
                      onChange={e => setDifficulty(color, e.target.value as CpuDifficulty)}
                      className="text-[11px] bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-full px-2 py-1 text-foreground focus:outline-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Pro</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Avatar Selector Tray */}
              {editingAvatar === color && (
                <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-2 animate-apple-spring">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => setAvatar(color, av)}
                      className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-lg hover:scale-120 transition-transform"
                    >
                      {av}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Actions */}
      <div className="space-y-3">
        <button
          onClick={handleStart}
          disabled={activePlayers < 2}
          className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 text-[16px] shadow-sm py-3"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Match ({activePlayers} Players)</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleDemo}
            className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/15 text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Auto-Match</span>
          </button>

          {onOnlineClick && (
            <button
              onClick={onOnlineClick}
              className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/15 text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Multiplayer Room</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
