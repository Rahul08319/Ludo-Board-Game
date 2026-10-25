import React, { useState } from 'react';
import { MultiplayerFallbackScreen } from './MultiplayerFallbackScreen';
import { Copy, Check, Users, ArrowLeft, Play, Globe, ShieldAlert } from 'lucide-react';

interface MultiplayerLobbyProps {
  onCreateRoom: (name: string, avatar: string, maxPlayers: number) => Promise<string | null>;
  onJoinRoom: (code: string, name: string, avatar: string) => Promise<boolean>;
  onBack: () => void;
  loading: boolean;
  error: string | null;
  room: { roomCode: string; playerCount: number; maxPlayers: number } | null;
  lobbyPlayers: { color: string; name: string; avatar: string }[];
  isHost: boolean;
  onStartGame: () => void;
  onStartPassAndPlay?: () => void;
  onStartSoloAI?: () => void;
  onOpenDebug?: () => void;
}

const AVATARS = ['🦁', '🐲', '🧙', '🦊', '👤', '🐯', '🐼', '🦅', '👑', '⚔️', '🛡️', '🐻'];

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  onBack,
  loading,
  error,
  room,
  lobbyPlayers,
  isHost,
  onStartGame,
  onStartPassAndPlay,
  onStartSoloAI,
  onOpenDebug,
}) => {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦁');
  const [joinCode, setJoinCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [copied, setCopied] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);

  const handleCreate = async () => {
    await onCreateRoom(name.trim() || 'Player', avatar, maxPlayers);
  };

  const handleJoin = async () => {
    await onJoinRoom(joinCode.trim(), name.trim() || 'Player', avatar);
  };

  const copyCode = () => {
    if (room) {
      try {
        const url = `${window.location.origin}?join=${room.roomCode}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access restricted in some sandboxes
      }
    }
  };

  const colorDots: Record<string, string> = {
    red: 'bg-[#FF3B30]',
    blue: 'bg-[#007AFF]',
    yellow: 'bg-[#FF9500]',
    green: 'bg-[#34C759]',
  };

  const isFatalError = error && (
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('offline') ||
    error.toLowerCase().includes('fetch') ||
    error.toLowerCase().includes('unreachable') ||
    error.toLowerCase().includes('failed to register')
  );

  // If a fatal connection error is detected or the user requested fallback view, show fallback screen
  if (forceFallback || isFatalError) {
    return (
      <MultiplayerFallbackScreen
        error={error}
        onRetry={() => {
          setForceFallback(false);
          setMode('choose');
        }}
        onBack={onBack}
        onStartPassAndPlay={onStartPassAndPlay}
        onStartSoloAI={onStartSoloAI}
        onOpenDebug={onOpenDebug}
      />
    );
  }

  // In-room lobby view
  if (room) {
    return (
      <div className="w-full max-w-md mx-auto rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation select-none animate-apple-spring">
        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] text-[12px] font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Multiplayer Room</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Game Lobby
          </h2>
        </div>

        {/* Room Code Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xl font-mono font-bold tracking-widest text-foreground px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
            {room.roomCode}
          </span>
          <button
            onClick={copyCode}
            className="apple-pill-btn bg-[#0066cc] text-white text-[12px] py-1.5 px-3 flex items-center gap-1"
            title="Copy Invite Link"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Players List */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
            <span>Players</span>
            <span>{lobbyPlayers.length} of {room.maxPlayers}</span>
          </div>

          {lobbyPlayers.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm"
            >
              <span className="text-2xl">{p.avatar}</span>
              <div className={`w-3 h-3 rounded-full ${colorDots[p.color] || 'bg-muted'} shadow-sm`} />
              <span className="font-semibold text-[14px] text-foreground tracking-tight">{p.name}</span>
              {i === 0 && (
                <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] font-bold">
                  Host
                </span>
              )}
            </div>
          ))}

          {Array.from({ length: room.maxPlayers - lobbyPlayers.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 opacity-60"
            >
              <span className="text-xl opacity-40">👤</span>
              <span className="text-[13px] text-muted-foreground italic">Waiting for player to join...</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-muted-foreground mb-5 leading-snug">
          Share room code <strong className="text-foreground font-mono">{room.roomCode}</strong> with friends to join.
        </p>

        {/* Host Start / Non-host waiting */}
        <div className="space-y-2.5">
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={lobbyPlayers.length < 2}
              className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 text-[15px] shadow-sm py-3"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lobbyPlayers.length < 2 ? 'Waiting for at least 2 players...' : 'Start Match Now'}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-center text-[13px] text-muted-foreground">
              Waiting for the host to start the match...
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-2.5 rounded-full text-[13px] text-muted-foreground hover:text-foreground transition-colors apple-press"
          >
            Leave Lobby
          </button>
        </div>
      </div>
    );
  }

  // Choose / Create / Join views
  return (
    <div className="w-full max-w-md mx-auto rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation select-none animate-apple-spring">
      <div className="text-center space-y-1 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] text-[12px] font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-time Matchmaking</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Online Multiplayer
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Create a private room or enter a 6-character invite code.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-[13px] text-center mb-4 flex items-center justify-between gap-2">
          <span className="truncate">{error}</span>
          <button
            onClick={() => setForceFallback(true)}
            className="text-[11px] underline shrink-0 font-semibold"
          >
            Diagnostics
          </button>
        </div>
      )}

      {mode === 'choose' && (
        <div className="space-y-5">
          {/* Player setup */}
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-semibold text-muted-foreground block mb-1">Your Player Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name (e.g. Paladin)"
                maxLength={12}
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-[14px] text-foreground focus:outline-none focus:border-[#0066cc]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-muted-foreground block mb-1">Select Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-110 ${
                      avatar === av
                        ? 'bg-[#0066cc]/20 ring-2 ring-[#0066cc]'
                        : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setMode('create')}
              className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center justify-center gap-2 text-[15px] shadow-sm py-3"
            >
              <span>Create New Room</span>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/15 text-[14px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            >
              Join Existing Room
            </button>

            <button
              onClick={onBack}
              className="w-full py-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Menu</span>
            </button>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-muted-foreground block mb-1.5">Max Room Players</label>
            <div className="flex gap-2">
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setMaxPlayers(n)}
                  className={`flex-1 py-2 rounded-xl font-semibold text-[14px] transition-all apple-press ${
                    maxPlayers === n
                      ? 'bg-[#0066cc] text-white shadow-sm'
                      : 'bg-black/5 dark:bg-white/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {n} Players
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-50 text-white flex items-center justify-center gap-2 text-[15px] shadow-sm py-3"
          >
            {loading ? 'Creating Room...' : 'Confirm & Create Room'}
          </button>

          <button
            onClick={() => setMode('choose')}
            className="w-full py-2 text-[13px] text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-muted-foreground block mb-1.5">Enter 6-Character Code</label>
            <input
              type="text"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCDEF"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-foreground text-center font-mono text-2xl tracking-widest uppercase focus:outline-none focus:border-[#0066cc]"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={loading || joinCode.length < 6}
            className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-40 text-white flex items-center justify-center gap-2 text-[15px] shadow-sm py-3"
          >
            {loading ? 'Joining Room...' : 'Join Match'}
          </button>

          <button
            onClick={() => setMode('choose')}
            className="w-full py-2 text-[13px] text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiplayerLobby;
