import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { PlayerColor, PlayerType, GameState, CpuDifficulty } from '@/lib/ludoGame';
import {
  createInitialState,
  rollDice,
  getMovableTokens,
  moveToken,
  cpuSelectToken,
  toGlobalPosition,
} from '@/lib/ludoGame';
import { soundManager } from '@/lib/soundManager';
import GameSetup from '@/components/GameSetup';
import LudoBoard from '@/components/LudoBoard';
import Dice from '@/components/Dice';
import PlayerPanel from '@/components/PlayerPanel';
import RulesModal from '@/components/RulesModal';
import TurnHistory, { type LogEntry } from '@/components/TurnHistory';
import VictoryScreen, { type GameStats } from '@/components/VictoryScreen';
import MultiplayerLobby from '@/components/MultiplayerLobby';
import { MultiplayerErrorBoundary } from '@/components/MultiplayerErrorBoundary';
import GameTimer from '@/components/GameTimer';
import GameChat from '@/components/GameChat';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useGameChat } from '@/hooks/useGameChat';
import * as yt from '@/lib/ytPlayables';
import { runSmokeTest } from '@/lib/ytSmokeTest';
import { useTranslations } from '@/lib/i18n';
import DebugPanel from '@/components/DebugPanel';
import { createGrant, applyGrantOnce, pendingGrants } from '@/lib/rewardGrants';
import woodTable from '@/assets/wood-table.jpg';

// Apple Design components
import AppleGlobalNav, { type AppTheme } from '@/components/AppleGlobalNav';
import AppleSubNav from '@/components/AppleSubNav';
import { evaluateLudoMoveSystemOne } from '@/lib/typeSafeAI';
import { RotateCcw, Volume2, VolumeX, BookOpen, Bug, ShieldAlert, Award } from 'lucide-react';

let logIdCounter = 0;

const LudoGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [movableTokens, setMovableTokens] = useState<number[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [guaranteedSix, setGuaranteedSix] = useState(0);
  const [rewardBusy, setRewardBusy] = useState(false);
  const [rewardError, setRewardError] = useState<null | { outcome: yt.AdOutcome; attempts: number }>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const { t } = useTranslations();
  const [animatingToken, setAnimatingToken] = useState<{ color: PlayerColor; id: number } | null>(null);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({ totalRolls: 0, totalMoves: 0, totalKills: 0, perPlayer: {} as any });
  const [showVictory, setShowVictory] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [undoStack, setUndoStack] = useState<{ state: GameState; stats: GameStats; logs: LogEntry[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ state: GameState; stats: GameStats; logs: LogEntry[] }[]>([]);
  const [mentionedColors, setMentionedColors] = useState<PlayerColor[]>([]);
  const mentionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apple Design theme state
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('studio');
  const [showRulesModal, setShowRulesModal] = useState(false);

  const multiplayer = useMultiplayer();
  const isMultiplayerGame = !!multiplayer.room;
  const currentPlayerForChat = gameState?.players[gameState.currentPlayerIndex];
  const chat = useGameChat(
    isMultiplayerGame ? multiplayer.room!.id : null,
    currentPlayerForChat?.name || 'Player',
    currentPlayerForChat?.avatar || '👤',
    currentPlayerForChat?.color || 'red'
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevStateRef = useRef<GameState | null>(null);
  const animatingRef = useRef(false);

  // Apply theme class to document body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-oled', 'theme-wood', 'theme-ceramic');
    if (currentTheme === 'studio') {
      root.classList.add('dark');
    } else if (currentTheme === 'oled') {
      root.classList.add('dark', 'theme-oled');
    } else if (currentTheme === 'wood') {
      root.classList.add('theme-wood');
    } else {
      root.classList.add('theme-ceramic');
    }
  }, [currentTheme]);

  // YouTube Playables SDK lifecycle
  useEffect(() => {
    yt.firstFrameReady();

    const initialAudio = yt.isAudioEnabled();
    setSoundOn(initialAudio);
    soundManager.setEnabled(initialAudio);

    const offAudio = yt.onAudioEnabledChange((enabled) => {
      setSoundOn(enabled);
      soundManager.setEnabled(enabled);
    });
    const offPause = yt.onPause(() => {
      const snapshot = { gameState, gameStats, logEntries };
      yt.saveData(JSON.stringify(snapshot));
    });
    const offResume = yt.onResume(() => {});

    (async () => {
      const raw = await yt.loadData();
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.gameState && !gameState) {
          setGameState(parsed.gameState);
          if (parsed.gameStats) setGameStats(parsed.gameStats);
          if (Array.isArray(parsed.logEntries)) setLogEntries(parsed.logEntries);
        }
      } catch (e) {
        console.warn('[ytgame] failed to parse save data', e);
        yt.logWarning();
      }
    })();

    return () => {
      offAudio?.();
      offPause?.();
      offResume?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    yt.gameReady();
  }, [gameState, showMultiplayer]);

  // Load high score
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ludo-best-score');
      if (raw) setBestScore(Number(raw) || 0);
    } catch {}
  }, []);

  // Update high score on win
  useEffect(() => {
    if (gameState?.phase === 'finished' && gameState.winner) {
      const winnerPlayer = gameState.players.find(p => p.color === gameState.winner);
      const isHumanWinner = winnerPlayer?.type === 'human';
      const humanKills = winnerPlayer ? (gameStats.perPlayer[winnerPlayer.color]?.kills ?? 0) : 0;
      const score = (isHumanWinner ? 1000 : 200) + humanKills * 50;

      if (score > bestScore) {
        setBestScore(score);
        try {
          localStorage.setItem('ludo-best-score', String(score));
        } catch {}
      }

      yt.sendScore(score);
    }
  }, [gameState?.phase, gameState?.winner, gameState?.players, gameStats, bestScore]);

  // Smoke test hook
  useEffect(() => {
    (window as any).__runSmokeTest = async () => {
      console.log('[SmokeTest] starting...');
      const results = await runSmokeTest();
      console.table(results);
      return results;
    };
    return () => {
      delete (window as any).__runSmokeTest;
    };
  }, []);

  // Rewarded Ad integration
  const REWARD_ID = 'reward_guaranteed_six';
  const runRewardedAd = useCallback(async (attemptNumber: number = 1) => {
    if (rewardBusy) return;
    setRewardBusy(true);
    setRewardError(null);
    yt.logAdEvent('REQUEST', REWARD_ID, undefined, attemptNumber);

    try {
      const result = await yt.requestRewardedAd();
      yt.logAdEvent('SHOW', REWARD_ID, result.outcome, attemptNumber);

      if (result.outcome === 'GRANTED') {
        const grant = createGrant('GUARANTEED_SIX', 1);
        const applied = applyGrantOnce(grant.id, (g) => {
          setGuaranteedSix(n => n + g.amount);
        });
        if (applied) {
          yt.logAdEvent('CLAIM', REWARD_ID, result.outcome, attemptNumber);
        }
      } else {
        setRewardError({ outcome: result.outcome, attempts: attemptNumber });
      }
    } catch (e) {
      console.warn('[RewardedAd] failed', e);
      yt.logWarning();
      setRewardError({ outcome: 'ERROR', attempts: attemptNumber });
    } finally {
      setRewardBusy(false);
    }
  }, [rewardBusy]);

  const handleWatchRewardedAd = useCallback(() => runRewardedAd(1), [runRewardedAd]);
  const handleRetryRewardedAd = useCallback(() => {
    const next = (rewardError?.attempts ?? 0) + 1;
    if (next > 3) return;
    yt.logAdEvent('RETRY', REWARD_ID, undefined, next);
    runRewardedAd(next);
  }, [rewardError, runRewardedAd]);

  const handleMention = useCallback((colors: PlayerColor[]) => {
    setMentionedColors(colors);
    if (mentionTimerRef.current) clearTimeout(mentionTimerRef.current);
    mentionTimerRef.current = setTimeout(() => setMentionedColors([]), 4000);
  }, []);

  const addLog = useCallback((color: PlayerColor, message: string, type: LogEntry['type']) => {
    setLogEntries(prev => [...prev, { id: ++logIdCounter, color, message, type, timestamp: Date.now() }]);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setEnabled(next);
  };

  const initStats = (configs: { color: PlayerColor; type: PlayerType }[]): GameStats => {
    const perPlayer = {} as GameStats['perPlayer'];
    configs.filter(c => c.type !== 'empty').forEach(c => {
      perPlayer[c.color] = { rolls: 0, moves: 0, kills: 0, sixes: 0 };
    });
    return { totalRolls: 0, totalMoves: 0, totalKills: 0, perPlayer };
  };

  const handleStart = (configs: { color: PlayerColor; type: PlayerType; name?: string; avatar?: string; difficulty?: CpuDifficulty }[]) => {
    logIdCounter = 0;
    setLogEntries([]);
    setGameStats(initStats(configs));
    setShowVictory(false);
    setUndoStack([]);
    setRedoStack([]);
    setGameState(createInitialState(configs));
  };

  const handleStartPassAndPlay = useCallback(() => {
    setShowMultiplayer(false);
    handleStart([
      { color: 'red', type: 'human', name: 'Player 1 (Red)', avatar: '🔴' },
      { color: 'green', type: 'human', name: 'Player 2 (Green)', avatar: '🟢' },
      { color: 'yellow', type: 'human', name: 'Player 3 (Yellow)', avatar: '🟡' },
      { color: 'blue', type: 'human', name: 'Player 4 (Blue)', avatar: '🔵' },
    ]);
  }, []);

  const handleStartSoloAI = useCallback(() => {
    setShowMultiplayer(false);
    handleStart([
      { color: 'red', type: 'human', name: 'You (Champion)', avatar: '👑' },
      { color: 'blue', type: 'cpu', name: 'Computer 1', avatar: '🤖', difficulty: 'hard' },
      { color: 'green', type: 'cpu', name: 'Computer 2', avatar: '🧠', difficulty: 'hard' },
      { color: 'yellow', type: 'cpu', name: 'Computer 3', avatar: '⚡', difficulty: 'hard' },
    ]);
  }, []);

  // Undo / Redo
  const saveUndoSnapshot = useCallback(() => {
    if (!gameState) return;
    setUndoStack(prev => [...prev.slice(-19), { state: JSON.parse(JSON.stringify(gameState)), stats: JSON.parse(JSON.stringify(gameStats)), logs: [...logEntries] }]);
    setRedoStack([]);
  }, [gameState, gameStats, logEntries]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || animatingRef.current) return;
    const snapshot = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { state: JSON.parse(JSON.stringify(gameState!)), stats: JSON.parse(JSON.stringify(gameStats)), logs: [...logEntries] }]);
    setUndoStack(prev => prev.slice(0, -1));
    setGameState(snapshot.state);
    setGameStats(snapshot.stats);
    setLogEntries(snapshot.logs);
    setMovableTokens([]);
    prevStateRef.current = snapshot.state;
  }, [undoStack, gameState, gameStats, logEntries]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || animatingRef.current) return;
    const snapshot = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { state: JSON.parse(JSON.stringify(gameState!)), stats: JSON.parse(JSON.stringify(gameStats)), logs: [...logEntries] }]);
    setRedoStack(prev => prev.slice(0, -1));
    setGameState(snapshot.state);
    setGameStats(snapshot.stats);
    setLogEntries(snapshot.logs);
    setMovableTokens([]);
    prevStateRef.current = snapshot.state;
  }, [redoStack, gameState, gameStats, logEntries]);

  // Audio and logging events on state change
  useEffect(() => {
    if (!gameState || !prevStateRef.current) {
      prevStateRef.current = gameState;
      return;
    }
    const prev = prevStateRef.current;
    const player = gameState.players[
      prev.currentPlayerIndex < prev.players.length ? prev.currentPlayerIndex : 0
    ];
    const playerColor = player?.color || 'red';

    if (gameState.phase === 'finished' && prev.phase !== 'finished') {
      soundManager.win();
      addLog(gameState.winner || playerColor, `🏆 Wins the match!`, 'goal');
      setShowVictory(true);
    } else if (gameState.message.includes('💀')) {
      soundManager.tokenKill();
      addLog(playerColor, gameState.message.replace(/.*?'s turn\.?/, '').trim() || gameState.message, 'kill');
      setGameStats(s => ({
        ...s, totalKills: s.totalKills + 1,
        perPlayer: { ...s.perPlayer, [playerColor]: { ...s.perPlayer[playerColor], kills: (s.perPlayer[playerColor]?.kills ?? 0) + 1 } },
      }));
    } else if (gameState.message.includes('🎉')) {
      soundManager.tokenGoal();
      addLog(playerColor, 'Reached the goal! (+10 bonus)', 'goal');
    } else if (gameState.message.includes("can't move")) {
      soundManager.cantMove();
      addLog(playerColor, `Rolled ${gameState.diceValue} — blocked`, 'skip');
    } else if (gameState.message.includes('moved a token out')) {
      soundManager.tokenOut();
      addLog(playerColor, 'Token deployed from base!', 'move');
      setGameStats(s => ({ ...s, totalMoves: s.totalMoves + 1, perPlayer: { ...s.perPlayer, [playerColor]: { ...s.perPlayer[playerColor], moves: (s.perPlayer[playerColor]?.moves ?? 0) + 1 } } }));
    } else if (gameState.message.includes('moved forward')) {
      const diceMatch = gameState.message.match(/(\d+) spaces/);
      addLog(playerColor, `Advanced ${diceMatch ? diceMatch[1] : gameState.diceValue ?? prev.diceValue ?? '?'} cells`, 'move');
      setGameStats(s => ({ ...s, totalMoves: s.totalMoves + 1, perPlayer: { ...s.perPlayer, [playerColor]: { ...s.perPlayer[playerColor], moves: (s.perPlayer[playerColor]?.moves ?? 0) + 1 } } }));
    } else if (gameState.message.includes('home column')) {
      addLog(playerColor, `Entered victory column`, 'move');
      setGameStats(s => ({ ...s, totalMoves: s.totalMoves + 1, perPlayer: { ...s.perPlayer, [playerColor]: { ...s.perPlayer[playerColor], moves: (s.perPlayer[playerColor]?.moves ?? 0) + 1 } } }));
    }

    prevStateRef.current = gameState;
  }, [gameState, addLog]);

  // Step-by-step fluid hopping animation
  const animateAndMove = useCallback((state: GameState, tokenId: number, onDone: () => void) => {
    const player = state.players[state.currentPlayerIndex];
    const token = player.tokens.find(t => t.id === tokenId)!;
    const dice = state.diceValue!;
    const color = player.color;

    const steps: number[] = [];
    if (token.isHome) {
      steps.push(0);
    } else {
      for (let i = 1; i <= dice; i++) {
        steps.push(token.position + i);
      }
    }

    if (steps.length === 0) {
      const result = moveToken(state, tokenId);
      onDone();
      setGameState(result);
      return;
    }

    animatingRef.current = true;
    setAnimatingToken({ color, id: tokenId });

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(stepInterval);
        setAnimatingToken(null);
        animatingRef.current = false;
        const result = moveToken(state, tokenId);
        setGameState(result);
        onDone();
        return;
      }

      setGameState(prev => {
        if (!prev) return prev;
        const intermediate = JSON.parse(JSON.stringify(prev)) as GameState;
        const p = intermediate.players[intermediate.currentPlayerIndex];
        const t = p.tokens.find(tk => tk.id === tokenId)!;
        const pos = steps[stepIdx];

        if (t.isHome) {
          t.isHome = false;
          t.position = 0;
          t.globalPosition = toGlobalPosition(0, color);
        } else if (pos < 52) {
          t.position = pos;
          t.globalPosition = toGlobalPosition(pos, color);
        } else if (pos <= 57) {
          t.position = pos;
          t.globalPosition = -1;
        }

        return intermediate;
      });
      soundManager.tokenMove();
      stepIdx++;
    }, 110);
  }, []);

  const handleRoll = useCallback(() => {
    if (!gameState || gameState.phase !== 'rolling' || animatingRef.current) return;
    const currentP = gameState.players[gameState.currentPlayerIndex];
    if (currentP.type === 'human') {
      saveUndoSnapshot();
    }

    soundManager.diceRoll();
    const currentColor = gameState.players[gameState.currentPlayerIndex].color;
    const newState = { ...gameState, isRolling: true };
    setGameState(newState);

    setTimeout(() => {
      let dice = rollDice();
      if (guaranteedSix > 0) {
        dice = 6;
        setGuaranteedSix(n => Math.max(0, n - 1));
      }
      addLog(currentColor, `Rolled ${dice}`, 'roll');
      setGameStats(s => ({
        ...s, totalRolls: s.totalRolls + 1,
        perPlayer: { ...s.perPlayer, [currentColor]: {
          ...s.perPlayer[currentColor],
          rolls: (s.perPlayer[currentColor]?.rolls ?? 0) + 1,
          sixes: (s.perPlayer[currentColor]?.sixes ?? 0) + (dice === 6 ? 1 : 0),
        }},
      }));

      const stateWithDice: GameState = {
        ...gameState,
        diceValue: dice,
        isRolling: false,
        phase: 'selecting',
      };

      const player = stateWithDice.players[stateWithDice.currentPlayerIndex];
      const movable = getMovableTokens(player, dice, stateWithDice);

      if (movable.length === 0) {
        const nextIdx = (stateWithDice.currentPlayerIndex + 1) % stateWithDice.players.length;
        const skipped: GameState = {
          ...stateWithDice,
          phase: 'rolling',
          diceValue: dice,
          currentPlayerIndex: nextIdx,
          consecutiveSixes: 0,
          message: `${player.name} rolled ${dice} but has no open move. ${stateWithDice.players[nextIdx].name}'s turn.`,
        };
        setGameState(skipped);
        setMovableTokens([]);
      } else if (movable.length === 1) {
        setMovableTokens(movable);
        animateAndMove(stateWithDice, movable[0], () => setMovableTokens([]));
      } else {
        setMovableTokens(movable);
        stateWithDice.message = `${player.name} rolled ${dice}. Select a counter to advance.`;
        setGameState(stateWithDice);
      }
    }, 550);
  }, [gameState, addLog, animateAndMove, saveUndoSnapshot, guaranteedSix]);

  const handleTokenClick = useCallback((color: PlayerColor, tokenId: number) => {
    if (!gameState || gameState.phase !== 'selecting' || animatingRef.current) return;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (color !== currentPlayer.color) return;
    if (!movableTokens.includes(tokenId)) return;

    animateAndMove(gameState, tokenId, () => setMovableTokens([]));
  }, [gameState, movableTokens, animateAndMove]);

  // CPU auto-play with TypeSafe System One for hard difficulty
  useEffect(() => {
    if (!gameState) return;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.type !== 'cpu' || gameState.phase === 'finished') return;

    if (gameState.phase === 'rolling') {
      timeoutRef.current = setTimeout(() => handleRoll(), 900);
    } else if (gameState.phase === 'selecting' && movableTokens.length > 0) {
      timeoutRef.current = setTimeout(() => {
        let tokenId = -1;
        if (currentPlayer.difficulty === 'hard') {
          // TypeSafe System One Intelligent Selection
          const evaluation = evaluateLudoMoveSystemOne(gameState, movableTokens);
          tokenId = evaluation.recommendedTokenId ?? cpuSelectToken(gameState, 'hard');
        } else {
          tokenId = cpuSelectToken(gameState, currentPlayer.difficulty);
        }

        if (tokenId >= 0) {
          handleTokenClick(currentPlayer.color, tokenId);
        }
      }, 750);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, movableTokens, handleRoll, handleTokenClick]);

  // Multiplayer state updates
  useEffect(() => {
    if (multiplayer.room?.gameState && multiplayer.room.status === 'playing') {
      setGameState(multiplayer.room.gameState);
    }
  }, [multiplayer.room?.gameState, multiplayer.room?.status]);

  // Auto-join from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      setShowMultiplayer(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const lobbyPlayers = multiplayer.room
    ? ((multiplayer.room as any).gameState?.players || []).map((p: any) => ({
        color: p.color, name: p.name, avatar: p.avatar,
      }))
    : [];

  const [lobbyData, setLobbyData] = useState<any[]>([]);
  useEffect(() => {
    if (!multiplayer.room || multiplayer.room.status !== 'waiting') return;
    const fetchLobby = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase
        .from('game_rooms')
        .select('game_state')
        .eq('id', multiplayer.room!.id)
        .single();
      if (data?.game_state) {
        const gs = data.game_state as any;
        setLobbyData(gs.players || []);
      }
    };
    fetchLobby();
    const interval = setInterval(fetchLobby, 2000);
    return () => clearInterval(interval);
  }, [multiplayer.room?.id, multiplayer.room?.status, multiplayer.room?.playerCount]);

  const handleStartMultiplayerGame = useCallback(async () => {
    if (!multiplayer.room) return;
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase
      .from('game_rooms')
      .select('game_state')
      .eq('id', multiplayer.room.id)
      .single();
    if (!data?.game_state) return;
    const lobby = data.game_state as any;
    const configs = lobby.players.map((p: any) => ({
      color: p.color as PlayerColor,
      type: 'human' as PlayerType,
      name: p.name,
      avatar: p.avatar,
    }));
    const initialState = createInitialState(configs);
    await multiplayer.startMultiplayerGame(initialState);
    setGameState(initialState);
    setGameStats(initStats(configs));
  }, [multiplayer]);

  // Background styling based on active theme
  const getBackgroundStyle = () => {
    if (currentTheme === 'wood') {
      return { backgroundImage: `url(${woodTable})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return {};
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300" style={getBackgroundStyle()}>
      {/*  Apple Global Navigation */}
      <AppleGlobalNav
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        soundEnabled={soundOn}
        onToggleSound={toggleSound}
        onOpenRules={() => setShowRulesModal(true)}
      />

      {/*  Apple Sub-Navigation */}
      <AppleSubNav
        onNewGame={() => setGameState(null)}
        isPlaying={!!gameState}
        onOpenRules={() => setShowRulesModal(true)}
        onToggleHistory={() => setShowHistory(h => !h)}
      />

      {/* Main Surface */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-[1440px] mx-auto">
        {showMultiplayer && !gameState ? (
          <MultiplayerErrorBoundary
            onBack={() => { multiplayer.leaveRoom(); setShowMultiplayer(false); }}
            onStartPassAndPlay={handleStartPassAndPlay}
            onStartSoloAI={handleStartSoloAI}
            onOpenDebug={() => setShowDebug(true)}
          >
            <MultiplayerLobby
              onCreateRoom={multiplayer.createRoom}
              onJoinRoom={multiplayer.joinRoom}
              onBack={() => { multiplayer.leaveRoom(); setShowMultiplayer(false); }}
              loading={multiplayer.loading}
              error={multiplayer.error}
              room={multiplayer.room ? { roomCode: multiplayer.room.roomCode, playerCount: multiplayer.room.playerCount, maxPlayers: multiplayer.room.maxPlayers } : null}
              lobbyPlayers={lobbyData.length > 0 ? lobbyData : lobbyPlayers}
              isHost={multiplayer.room ? multiplayer.room.hostPlayerId === multiplayer.playerId : false}
              onStartGame={handleStartMultiplayerGame}
              onStartPassAndPlay={handleStartPassAndPlay}
              onStartSoloAI={handleStartSoloAI}
              onOpenDebug={() => setShowDebug(true)}
            />
          </MultiplayerErrorBoundary>
        ) : !gameState ? (
          <GameSetup
            onStart={handleStart}
            onOnlineClick={() => setShowMultiplayer(true)}
          />
        ) : (
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:items-start py-2">
            {/* Board Stage */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              {/* Top Control Cluster */}
              <div className="flex items-center gap-3 w-full max-w-[500px] justify-between">
                <PlayerPanel gameState={gameState} mentionedColors={mentionedColors} />
                <GameTimer currentPlayerColor={gameState.players[gameState.currentPlayerIndex].color} isFinished={gameState.phase === 'finished'} />
                <div className="flex gap-1">
                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0 || animatingRef.current}
                    className="p-2 rounded-full apple-glass border border-black/10 dark:border-white/10 text-foreground text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed apple-press"
                    title="Undo"
                  >
                    ↩️
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0 || animatingRef.current}
                    className="p-2 rounded-full apple-glass border border-black/10 dark:border-white/10 text-foreground text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed apple-press"
                    title="Redo"
                  >
                    ↪️
                  </button>
                  <button
                    onClick={() => setShowHistory(h => !h)}
                    className={`p-2 rounded-full apple-glass border border-black/10 dark:border-white/10 text-foreground text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press ${showHistory ? 'bg-[#0066cc]/20' : ''}`}
                    title="Turn History"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => setShowDebug(d => !d)}
                    className="p-2 rounded-full apple-glass border border-black/10 dark:border-white/10 text-foreground text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
                    title="Debug Panel"
                  >
                    🐞
                  </button>
                </div>
              </div>

              {/* The Ludo Board */}
              <LudoBoard
                gameState={gameState}
                movableTokens={movableTokens}
                onTokenClick={handleTokenClick}
                animatingToken={animatingToken}
              />

              {/* Dice & Status Bar */}
              <div className="flex items-center gap-4 w-full max-w-[500px] justify-center mt-1">
                <Dice
                  value={gameState.diceValue}
                  isRolling={gameState.isRolling}
                  onClick={handleRoll}
                  disabled={gameState.phase !== 'rolling' || gameState.players[gameState.currentPlayerIndex].type !== 'human'}
                />

                {/* Status Message Pill */}
                <div className="flex-1 py-3 px-5 rounded-[20px] apple-glass border border-black/10 dark:border-white/10 text-center shadow-apple-subtle">
                  <p className="text-[14px] font-medium text-foreground tracking-tight leading-snug">
                    {gameState.message}
                  </p>
                </div>

                {/* Rewarded Ad Boost */}
                {gameState.players[gameState.currentPlayerIndex].type === 'human' && gameState.phase !== 'finished' && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={handleWatchRewardedAd}
                      disabled={rewardBusy}
                      className="apple-pill-btn bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold text-[13px] py-2 px-3.5 shadow-sm"
                      title="Watch Ad for Guaranteed 6"
                    >
                      {rewardBusy ? 'Ad...' : guaranteedSix > 0 ? `🎲 x${guaranteedSix}` : '🎲 Boost 6'}
                    </button>
                  </div>
                )}
              </div>

              {/* Play Again Button */}
              {gameState.phase === 'finished' && !showVictory && (
                <button
                  onClick={() => setGameState(null)}
                  className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white py-3 px-8 text-[16px] shadow-sm mt-2"
                >
                  Play Again
                </button>
              )}
            </div>

            {/* Right Column: Turn History */}
            {showHistory && (
              <div className="flex flex-col gap-4 w-full max-w-[380px]">
                <div className="rounded-[24px] apple-glass border border-black/10 dark:border-white/10 p-4 shadow-apple-subtle animate-apple-spring">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-semibold text-foreground uppercase tracking-wider">
                      Turn Log
                    </h4>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-[12px] text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>
                  <TurnHistory entries={logEntries} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rules Modal */}
      <RulesModal open={showRulesModal} onOpenChange={setShowRulesModal} />

      {/* Victory Screen */}
      {showVictory && gameState?.winner && (
        <VictoryScreen
          winner={gameState.winner}
          stats={gameStats}
          onPlayAgain={() => { setShowVictory(false); setGameState(null); }}
          players={gameState.players.map(p => ({ name: p.name, avatar: p.avatar, color: p.color }))}
        />
      )}

      {/* Multiplayer Chat */}
      {isMultiplayerGame && gameState && (
        <GameChat
          messages={chat.messages}
          onSend={chat.sendMessage}
          typingUsers={chat.typingUsers}
          onTyping={chat.sendTyping}
          isHost={multiplayer.room!.hostPlayerId === multiplayer.playerId}
          onClearChat={chat.clearHistory}
          players={gameState.players.map(p => ({ name: p.name, color: p.color, avatar: p.avatar }))}
          selfName={currentPlayerForChat?.name}
          onMention={handleMention}
          onToggleReaction={chat.toggleReaction}
        />
      )}

      <DebugPanel open={showDebug} onClose={() => setShowDebug(false)} />
    </div>
  );
};

export default LudoGame;
