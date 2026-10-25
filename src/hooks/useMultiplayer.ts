import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GameState, PlayerColor, PlayerType } from '@/lib/ludoGame';
import type { Json } from '@/integrations/supabase/types';
import { logHealthWarning, logHealthError } from '@/lib/ytPlayables';

export type PlayerIdSource = 'sessionStorage' | 'memory';

export interface MultiplayerDiagnostics {
  sessionStatus: 'idle' | 'creating' | 'joining' | 'in_lobby' | 'playing' | 'error' | 'unavailable';
  playerId: string;
  playerIdSource: PlayerIdSource;
  storageAccessible: boolean;
  lastSyncError: string | null;
  lastSyncTimestamp: number | null;
  roomCode: string | null;
  isOnline: boolean;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// In-memory fallback player ID
let memoryPlayerId: string | null = null;
let currentSource: PlayerIdSource = 'memory';
let storageTested = false;
let isStorageUsable = false;

// Probe sessionStorage without ever throwing in sandboxed iframes
export function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    // Guard against environments where window.sessionStorage getter throws SecurityError
    const storage = window.sessionStorage;
    if (!storage) return null;

    if (!storageTested) {
      storageTested = true;
      const testKey = '__ludo_probe__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      isStorageUsable = true;
    }
    return isStorageUsable ? storage : null;
  } catch (err: any) {
    storageTested = true;
    isStorageUsable = false;
    logHealthWarning(
      'STORAGE_ACCESS_BLOCKED',
      'sessionStorage access was denied or blocked (sandboxed iframe or private browsing). Falling back to in-memory storage.',
      { error: err?.message || String(err) }
    );
    return null;
  }
}

function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // crypto blocked or unavailable
  }
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Generates or retrieves player ID.
 * Supports passing customStorage (e.g. null) for testing and dev harnesses.
 */
export function generatePlayerId(customStorage?: Storage | null): string {
  const store = customStorage !== undefined ? customStorage : safeStorage();

  // Try reading from storage
  if (store) {
    try {
      const stored = store.getItem('ludo_player_id');
      if (stored) {
        currentSource = 'sessionStorage';
        notifyDiagnostics();
        return stored;
      }
    } catch (err: any) {
      logHealthWarning(
        'STORAGE_ACCESS_BLOCKED',
        'Failed to read ludo_player_id from sessionStorage. Falling back to in-memory ID.',
        { error: err?.message || String(err) }
      );
    }
  }

  // Fall back to memory cache if present
  if (memoryPlayerId) {
    currentSource = 'memory';
    notifyDiagnostics();
    return memoryPlayerId;
  }

  // Generate new ID
  const id = newId();
  memoryPlayerId = id;
  currentSource = 'memory';

  // Try saving to storage
  if (store) {
    try {
      store.setItem('ludo_player_id', id);
      currentSource = 'sessionStorage';
    } catch (err: any) {
      currentSource = 'memory';
      logHealthWarning(
        'STORAGE_QUOTA_EXCEEDED',
        'Failed to cache ludo_player_id into sessionStorage. Persisting in memory only.',
        { error: err?.message || String(err) }
      );
    }
  }

  notifyDiagnostics();
  return id;
}

export function getPlayerIdSource(): PlayerIdSource {
  return currentSource;
}

export function resetPlayerIdForTesting(): void {
  memoryPlayerId = null;
  currentSource = 'memory';
  storageTested = false;
  isStorageUsable = false;
}

// ── Dev Harness for Testing generatePlayerId when sessionStorage is null ──────

export interface GeneratePlayerIdTestResult {
  ok: boolean;
  playerId: string;
  source: PlayerIdSource;
  cachedConsistently: boolean;
  message: string;
  error?: string;
}

/**
 * Dev-only test harness to verify generatePlayerId behavior when sessionStorage is null.
 */
export function testGeneratePlayerIdWithNullStorage(): GeneratePlayerIdTestResult {
  try {
    const originalMemory = memoryPlayerId;
    const originalSource = currentSource;

    // Reset memory cache to force a fresh test run with null storage
    memoryPlayerId = null;
    const testId1 = generatePlayerId(null);
    const source1 = getPlayerIdSource();

    // Verify consistency: subsequent call with null storage must return the exact same memory ID
    const testId2 = generatePlayerId(null);
    const cachedConsistently = testId1 === testId2;

    const ok = !!testId1 && typeof testId1 === 'string' && testId1.length > 0 && source1 === 'memory' && cachedConsistently;

    // Restore original state if previously initialized
    if (originalMemory) {
      memoryPlayerId = originalMemory;
      currentSource = originalSource;
    }

    const result: GeneratePlayerIdTestResult = {
      ok,
      playerId: testId1,
      source: source1,
      cachedConsistently,
      message: ok
        ? 'PASSED: generatePlayerId safely handled null sessionStorage, fell back to memory, and maintained cache consistency.'
        : 'FAILED: generatePlayerId did not return a valid memory-cached ID when storage was null.',
    };

    console.info('[DevHarness:generatePlayerId] Test Result:', result);
    return result;
  } catch (err: any) {
    const failure: GeneratePlayerIdTestResult = {
      ok: false,
      playerId: '',
      source: 'memory',
      cachedConsistently: false,
      message: 'FAILED with unhandled exception when sessionStorage is null',
      error: err?.message || String(err),
    };
    logHealthError('STORAGE_ERROR', 'testGeneratePlayerIdWithNullStorage failed', { error: failure.error });
    return failure;
  }
}

// Expose dev harness to window in development / browser environment
if (typeof window !== 'undefined') {
  (window as any).__testGeneratePlayerId = testGeneratePlayerIdWithNullStorage;
}

// ── Global Multiplayer Diagnostics Singleton ────────────────────────────────

let diagnosticsState: MultiplayerDiagnostics = {
  sessionStatus: 'idle',
  playerId: '',
  playerIdSource: 'memory',
  storageAccessible: true,
  lastSyncError: null,
  lastSyncTimestamp: null,
  roomCode: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
};

function notifyDiagnostics() {
  diagnosticsState = {
    ...diagnosticsState,
    playerId: memoryPlayerId || '',
    playerIdSource: currentSource,
    storageAccessible: isStorageUsable,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ytgame:multiplayer', { detail: diagnosticsState }));
  }
}

export function getMultiplayerDiagnostics(): MultiplayerDiagnostics {
  return { ...diagnosticsState };
}

export function recordSyncError(errorMsg: string) {
  diagnosticsState = {
    ...diagnosticsState,
    sessionStatus: 'error',
    lastSyncError: errorMsg,
    lastSyncTimestamp: Date.now(),
  };
  notifyDiagnostics();
}

// ── Hook Definition ──────────────────────────────────────────────────────────

export interface MultiplayerRoom {
  id: string;
  roomCode: string;
  status: string;
  playerCount: number;
  maxPlayers: number;
  gameState: GameState | null;
  hostPlayerId: string;
}

export function useMultiplayer() {
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerId] = useState(() => generatePlayerId());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Keep diagnostic state synchronized with component lifecycle
  useEffect(() => {
    diagnosticsState.playerId = playerId;
    diagnosticsState.playerIdSource = currentSource;
    diagnosticsState.storageAccessible = isStorageUsable;
    diagnosticsState.roomCode = room?.roomCode ?? null;
    diagnosticsState.sessionStatus = room
      ? room.status === 'playing' ? 'playing' : 'in_lobby'
      : error ? 'error' : 'idle';
    notifyDiagnostics();
  }, [room, playerId, error]);

  const createRoom = useCallback(async (playerName: string, playerAvatar: string, maxPlayers = 4) => {
    setLoading(true);
    setError(null);
    diagnosticsState.sessionStatus = 'creating';
    notifyDiagnostics();

    // Check connectivity
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const err = 'You appear to be offline. Please verify your internet connection.';
      setError(err);
      recordSyncError(err);
      logHealthError('MULTIPLAYER_ROOM_ERROR', 'createRoom failed: client offline');
      setLoading(false);
      return null;
    }

    try {
      const roomCode = generateRoomCode();

      const lobbyState = {
        players: [{
          color: 'red' as PlayerColor,
          type: 'human' as PlayerType,
          name: playerName,
          avatar: playerAvatar,
          playerId,
          ready: true,
        }],
        status: 'waiting',
        maxPlayers,
      };

      const { data, error: err } = await supabase
        .from('game_rooms')
        .insert({
          room_code: roomCode,
          host_player_id: playerId,
          game_state: lobbyState as unknown as Json,
          status: 'waiting',
          max_players: maxPlayers,
          player_count: 1,
        })
        .select()
        .single();

      if (err) {
        const errorMsg = err.message || 'Database error creating room';
        setError(errorMsg);
        recordSyncError(errorMsg);
        logHealthError('MULTIPLAYER_ROOM_ERROR', `createRoom Supabase error: ${errorMsg}`, { code: err.code });
        setLoading(false);
        return null;
      }

      if (!data) {
        const errorMsg = 'No response received from room creation';
        setError(errorMsg);
        recordSyncError(errorMsg);
        logHealthError('MULTIPLAYER_ROOM_ERROR', errorMsg);
        setLoading(false);
        return null;
      }

      const newRoom: MultiplayerRoom = {
        id: data.id,
        roomCode: data.room_code,
        status: data.status,
        playerCount: data.player_count,
        maxPlayers: data.max_players,
        gameState: null,
        hostPlayerId: data.host_player_id,
      };

      setRoom(newRoom);
      setLoading(false);
      diagnosticsState.sessionStatus = 'in_lobby';
      diagnosticsState.roomCode = data.room_code;
      diagnosticsState.lastSyncError = null;
      diagnosticsState.lastSyncTimestamp = Date.now();
      notifyDiagnostics();

      subscribeToRoom(data.id);
      return roomCode;
    } catch (unexpectedErr: any) {
      const msg = unexpectedErr?.message || 'Unexpected network failure while creating room';
      setError(msg);
      recordSyncError(msg);
      logHealthError('MULTIPLAYER_INIT_FAILED', `createRoom uncaught exception: ${msg}`);
      setLoading(false);
      return null;
    }
  }, [playerId]);

  const joinRoom = useCallback(async (roomCode: string, playerName: string, playerAvatar: string) => {
    setLoading(true);
    setError(null);
    diagnosticsState.sessionStatus = 'joining';
    notifyDiagnostics();

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const err = 'You appear to be offline. Please verify your internet connection.';
      setError(err);
      recordSyncError(err);
      logHealthError('MULTIPLAYER_ROOM_ERROR', 'joinRoom failed: client offline');
      setLoading(false);
      return false;
    }

    try {
      const cleanCode = roomCode.trim().toUpperCase();
      const { data, error: err } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', cleanCode)
        .single();

      if (err || !data) {
        const msg = err?.message || 'Room not found. Please verify the 6-character code.';
        setError(msg);
        recordSyncError(msg);
        logHealthWarning('MULTIPLAYER_ROOM_ERROR', `joinRoom failed: ${msg}`, { roomCode: cleanCode });
        setLoading(false);
        return false;
      }

      if (data.status !== 'waiting') {
        const msg = 'Game already in progress or completed.';
        setError(msg);
        recordSyncError(msg);
        logHealthWarning('MULTIPLAYER_ROOM_ERROR', msg, { roomCode: cleanCode });
        setLoading(false);
        return false;
      }

      const lobbyState = data.game_state as any;
      if (!lobbyState?.players || !Array.isArray(lobbyState.players)) {
        const msg = 'Corrupt lobby state in room';
        setError(msg);
        recordSyncError(msg);
        logHealthError('MULTIPLAYER_ROOM_ERROR', msg, { roomCode: cleanCode });
        setLoading(false);
        return false;
      }

      if (lobbyState.players.length >= data.max_players) {
        const msg = 'Room is full';
        setError(msg);
        recordSyncError(msg);
        logHealthWarning('MULTIPLAYER_ROOM_ERROR', msg, { roomCode: cleanCode });
        setLoading(false);
        return false;
      }

      // Check if already joined
      const alreadyIn = lobbyState.players.find((p: any) => p.playerId === playerId);
      if (!alreadyIn) {
        const availableColors: PlayerColor[] = ['red', 'blue', 'yellow', 'green'];
        const takenColors = lobbyState.players.map((p: any) => p.color);
        const color = availableColors.find(c => !takenColors.includes(c)) || 'blue';

        lobbyState.players.push({
          color,
          type: 'human',
          name: playerName,
          avatar: playerAvatar,
          playerId,
          ready: true,
        });

        const { error: updateErr } = await supabase
          .from('game_rooms')
          .update({
            game_state: lobbyState as unknown as Json,
            player_count: lobbyState.players.length,
          })
          .eq('id', data.id);

        if (updateErr) {
          const msg = updateErr.message || 'Failed to register player in room';
          setError(msg);
          recordSyncError(msg);
          logHealthError('MULTIPLAYER_ROOM_ERROR', `joinRoom update failed: ${msg}`);
          setLoading(false);
          return false;
        }
      }

      setRoom({
        id: data.id,
        roomCode: data.room_code,
        status: data.status,
        playerCount: lobbyState.players.length,
        maxPlayers: data.max_players,
        gameState: null,
        hostPlayerId: data.host_player_id,
      });

      setLoading(false);
      diagnosticsState.sessionStatus = 'in_lobby';
      diagnosticsState.roomCode = data.room_code;
      diagnosticsState.lastSyncError = null;
      diagnosticsState.lastSyncTimestamp = Date.now();
      notifyDiagnostics();

      subscribeToRoom(data.id);
      return true;
    } catch (unexpectedErr: any) {
      const msg = unexpectedErr?.message || 'Unexpected network failure while joining room';
      setError(msg);
      recordSyncError(msg);
      logHealthError('MULTIPLAYER_INIT_FAILED', `joinRoom uncaught exception: ${msg}`);
      setLoading(false);
      return false;
    }
  }, [playerId]);

  const subscribeToRoom = useCallback((roomId: string) => {
    try {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`room-${roomId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
          (payload) => {
            try {
              const row = payload.new as any;
              setRoom(prev => prev ? {
                ...prev,
                status: row.status,
                playerCount: row.player_count,
                gameState: row.status === 'playing' ? row.game_state as GameState : null,
              } : null);
              diagnosticsState.lastSyncTimestamp = Date.now();
              notifyDiagnostics();
            } catch (err: any) {
              logHealthWarning('MULTIPLAYER_SYNC_FAILED', 'Error handling realtime room update payload', { error: err?.message });
            }
          }
        )
        .subscribe((status, err) => {
          if (err || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            const errorMsg = `Realtime channel error (${status}): ${err?.message || 'Timeout'}`;
            recordSyncError(errorMsg);
            logHealthWarning('REALTIME_CHANNEL_FAILED', errorMsg, { roomId });
          }
        });

      channelRef.current = channel;
    } catch (e: any) {
      const errorMsg = `Realtime subscription setup failed: ${e?.message}`;
      recordSyncError(errorMsg);
      logHealthError('REALTIME_CHANNEL_FAILED', errorMsg);
    }
  }, []);

  const updateGameState = useCallback(async (gameState: GameState) => {
    if (!room) return;
    try {
      const { error: err } = await supabase
        .from('game_rooms')
        .update({
          game_state: gameState as unknown as Json,
          status: gameState.phase === 'finished' ? 'finished' : 'playing',
        })
        .eq('id', room.id);

      if (err) {
        recordSyncError(err.message);
        logHealthWarning('MULTIPLAYER_SYNC_FAILED', `updateGameState failed: ${err.message}`);
      } else {
        diagnosticsState.lastSyncTimestamp = Date.now();
        diagnosticsState.lastSyncError = null;
        notifyDiagnostics();
      }
    } catch (e: any) {
      recordSyncError(e?.message || 'Sync failed');
      logHealthError('MULTIPLAYER_SYNC_FAILED', `updateGameState exception: ${e?.message}`);
    }
  }, [room]);

  const startMultiplayerGame = useCallback(async (gameState: GameState) => {
    if (!room) return;
    try {
      const { error: err } = await supabase
        .from('game_rooms')
        .update({
          game_state: gameState as unknown as Json,
          status: 'playing',
        })
        .eq('id', room.id);

      if (err) {
        recordSyncError(err.message);
        logHealthError('MULTIPLAYER_SYNC_FAILED', `startMultiplayerGame failed: ${err.message}`);
      } else {
        diagnosticsState.sessionStatus = 'playing';
        diagnosticsState.lastSyncTimestamp = Date.now();
        diagnosticsState.lastSyncError = null;
        notifyDiagnostics();
      }
    } catch (e: any) {
      recordSyncError(e?.message || 'Start match failed');
      logHealthError('MULTIPLAYER_SYNC_FAILED', `startMultiplayerGame exception: ${e?.message}`);
    }
  }, [room]);

  const leaveRoom = useCallback(() => {
    try {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    } catch (e: any) {
      console.warn('[useMultiplayer] removeChannel exception on leaveRoom', e);
    }
    setRoom(null);
    diagnosticsState.sessionStatus = 'idle';
    diagnosticsState.roomCode = null;
    notifyDiagnostics();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch {}
      }
    };
  }, []);

  return {
    room,
    loading,
    error,
    playerId,
    playerIdSource: currentSource,
    createRoom,
    joinRoom,
    updateGameState,
    startMultiplayerGame,
    leaveRoom,
  };
}
