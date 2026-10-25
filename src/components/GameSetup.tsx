import React, { useState } from 'react';
import type { PlayerColor, PlayerType, CpuDifficulty } from '@/lib/ludoGame';
import { PLAYER_COLORS } from '@/lib/ludoGame';
import { Play, Users, Bot, Globe, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

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
}

const AVATARS = [
  '🦁', '🐲', '🧙', '🦊', '👤', '🐯', '🐻', '🐼', '🦅', '👑', '⚔️', '🛡️'
];

const colorLabels: Record<PlayerColor, string> = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
  green: 'Green',
};

const defaultAvatars: Record<PlayerColor, string> = {
  red: '🦁',
  blue: '🐲',
  yellow: '🦊',
  green: '🧙',
};

const colorBorder: Record<PlayerColor, string> = {
  red: 'border-[#FF3B30]/30 focus-within:border-[#FF3B30]',
  blue: 'border-[#007AFF]/30 focus-within:border-[#007AFF]',
  yellow: 'border-[#FF9500]/30 focus-within:border-[#FF9500]',
  green: 'border-[#34C759]/30 focus-within:border-[#34C759]',
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
}) => {
  const [showCustomRoster, setShowCustomRoster] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<PlayerColor | null>(null);

  const [configs, setConfigs] = useState<Record<PlayerColor, { type: PlayerType; name: string; avatar: string; difficulty: CpuDifficulty }>>({
    red: { type: 'human', name: 'Player 1', avatar: defaultAvatars.red, difficulty: 'medium' },
    blue: { type: 'cpu', name: 'Computer 1', avatar: defaultAvatars.blue, difficulty: 'hard' },
    yellow: { type: 'cpu', name: 'Computer 2', avatar: defaultAvatars.yellow, difficulty: 'hard' },
    green: { type: 'cpu', name: 'Computer 3', avatar: defaultAvatars.green, difficulty: 'hard' },
  });

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

  // Instant Quick-Start Actions for real game feel
  const handleQuickSolo = (playerCount: 2 | 4) => {
    if (playerCount === 2) {
      onStart([
        { color: 'red', type: 'human', name: 'You', avatar: '🦁', difficulty: 'hard' },
        { color: 'yellow', type: 'cpu', name: 'Computer', avatar: '🦊', difficulty: 'hard' },
        { color: 'blue', type: 'empty', name: '', avatar: '🐲', difficulty: 'hard' },
        { color: 'green', type: 'empty', name: '', avatar: '🧙', difficulty: 'hard' },
      ]);
    } else {
      onStart([
        { color: 'red', type: 'human', name: 'You', avatar: '🦁', difficulty: 'hard' },
        { color: 'blue', type: 'cpu', name: 'Computer 1', avatar: '🐲', difficulty: 'hard' },
        { color: 'yellow', type: 'cpu', name: 'Computer 2', avatar: '🦊', difficulty: 'hard' },
        { color: 'green', type: 'cpu', name: 'Computer 3', avatar: '🧙', difficulty: 'hard' },
      ]);
    }
  };

  const handleQuickPassAndPlay = (playerCount: 2 | 4) => {
    if (playerCount === 2) {
      onStart([
        { color: 'red', type: 'human', name: 'Player 1', avatar: '🔴', difficulty: 'medium' },
        { color: 'yellow', type: 'human', name: 'Player 2', avatar: '🟡', difficulty: 'medium' },
        { color: 'blue', type: 'empty', name: '', avatar: '🔵', difficulty: 'medium' },
        { color: 'green', type: 'empty', name: '', avatar: '🟢', difficulty: 'medium' },
      ]);
    } else {
      onStart([
        { color: 'red', type: 'human', name: 'Player 1', avatar: '🔴', difficulty: 'medium' },
        { color: 'blue', type: 'human', name: 'Player 2', avatar: '🔵', difficulty: 'medium' },
        { color: 'yellow', type: 'human', name: 'Player 3', avatar: '🟡', difficulty: 'medium' },
        { color: 'green', type: 'human', name: 'Player 4', avatar: '🟢', difficulty: 'medium' },
      ]);
    }
  };

  const handleCustomStart = () => {
    onStart(PLAYER_COLORS.map(c => ({
      color: c,
      type: configs[c].type,
      name: configs[c].name.trim() || colorLabels[c],
      avatar: configs[c].avatar,
      difficulty: configs[c].difficulty,
    })));
  };

  const activePlayers = Object.values(configs).filter(t => t.type !== 'empty').length;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 select-none animate-apple-spring">
      {/* Game Title Logo */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] dice-ivory-8k mb-3 shadow-xl transform hover:rotate-6 transition-transform">
          <span className="text-3xl sm:text-4xl">🎲</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Ludo & Friends
        </h1>
        <p className="text-[14px] sm:text-[15px] text-muted-foreground mt-1">
          The Classic Board Game
        </p>
      </div>

      {/* Main Game Menu Cards */}
      <div className="w-full space-y-3.5">
        {/* 1. Play vs Computer */}
        <div className="rounded-[22px] apple-glass border border-black/10 dark:border-white/10 p-4 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0066cc]/10 dark:bg-[#0071e3]/20 flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-foreground leading-tight">
                  Play vs Computer
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Solo match with intelligent opponents
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSolo(2)}
              className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] py-2 text-center"
            >
              1 vs 1 Match
            </button>
            <button
              onClick={() => handleQuickSolo(4)}
              className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white text-[13px] py-2 text-center"
            >
              4-Player Classic
            </button>
          </div>
        </div>

        {/* 2. Pass & Play */}
        <div className="rounded-[22px] apple-glass border border-black/10 dark:border-white/10 p-4 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-foreground leading-tight">
                  Pass & Play
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Play with friends on this device
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickPassAndPlay(2)}
              className="apple-pill-btn bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] py-2 text-center"
            >
              2 Players
            </button>
            <button
              onClick={() => handleQuickPassAndPlay(4)}
              className="apple-pill-btn bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] py-2 text-center"
            >
              4 Players
            </button>
          </div>
        </div>

        {/* 3. Online Multiplayer */}
        {onOnlineClick && (
          <button
            onClick={onOnlineClick}
            className="w-full rounded-[22px] apple-glass border border-black/10 dark:border-white/10 p-4 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all flex items-center justify-between text-left apple-press"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-foreground leading-tight">
                  Online Multiplayer
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Create or join private room with code
                </p>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10">
              Join / Host →
            </span>
          </button>
        )}

        {/* 4. Custom Match Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowCustomRoster(!showCustomRoster)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors apple-press"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showCustomRoster ? 'Hide Custom Roster' : 'Custom Match & Avatars'}</span>
            {showCustomRoster ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCustomRoster && (
            <div className="mt-3 p-4 rounded-[22px] apple-glass border border-black/10 dark:border-white/10 space-y-3 animate-apple-spring">
              <h4 className="text-[13px] font-semibold text-foreground">
                Customize Player Names & Avatars
              </h4>

              {PLAYER_COLORS.map(color => {
                const cfg = configs[color];
                const isOff = cfg.type === 'empty';

                return (
                  <div
                    key={color}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOff
                        ? 'bg-black/5 dark:bg-white/5 border-transparent opacity-50'
                        : `bg-white/60 dark:bg-white/5 ${colorBorder[color]}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => setEditingAvatar(color)}
                          disabled={isOff}
                          className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform shrink-0"
                          title="Change Avatar"
                        >
                          {cfg.avatar}
                        </button>
                        <div className="min-w-0">
                          <span className={`inline-block w-2 h-2 rounded-full ${colorDot[color]} mr-1`} />
                          {!isOff ? (
                            <input
                              type="text"
                              value={cfg.name}
                              onChange={e => setName(color, e.target.value)}
                              placeholder={`Name`}
                              maxLength={12}
                              className="text-[12px] bg-transparent text-foreground border-b border-black/10 dark:border-white/15 focus:outline-none w-24"
                            />
                          ) : (
                            <span className="text-[12px] text-muted-foreground">{colorLabels[color]}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex bg-black/5 dark:bg-white/10 rounded-full p-0.5 text-[11px]">
                          <button
                            onClick={() => setType(color, 'human')}
                            className={`px-2 py-0.5 rounded-full ${cfg.type === 'human' ? 'bg-white dark:bg-[#272729] font-semibold text-foreground' : 'text-muted-foreground'}`}
                          >
                            Human
                          </button>
                          <button
                            onClick={() => setType(color, 'cpu')}
                            className={`px-2 py-0.5 rounded-full ${cfg.type === 'cpu' ? 'bg-white dark:bg-[#272729] font-semibold text-foreground' : 'text-muted-foreground'}`}
                          >
                            AI
                          </button>
                          <button
                            onClick={() => setType(color, 'empty')}
                            className={`px-2 py-0.5 rounded-full ${cfg.type === 'empty' ? 'bg-white dark:bg-[#272729] font-semibold text-foreground' : 'text-muted-foreground'}`}
                          >
                            Off
                          </button>
                        </div>
                      </div>
                    </div>

                    {editingAvatar === color && (
                      <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1.5">
                        {AVATARS.map(av => (
                          <button
                            key={av}
                            onClick={() => setAvatar(color, av)}
                            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-sm hover:scale-120 transition-transform"
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={handleCustomStart}
                disabled={activePlayers < 2}
                className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 text-white text-[14px] py-2.5 mt-2 flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Custom Match ({activePlayers} Players)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
