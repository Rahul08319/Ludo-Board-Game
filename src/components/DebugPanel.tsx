import React, { useEffect, useState } from 'react';
import {
  lifecycle,
  inPlayables,
  getLastAdEvent,
  getAdEventLog,
  getLastSentScore,
  getLastHealthEvent,
  getHealthLog,
  type AdEvent,
  type HealthLogEntry,
} from '@/lib/ytPlayables';
import { grantSummary } from '@/lib/rewardGrants';
import { useTranslations } from '@/lib/i18n';
import {
  getMultiplayerDiagnostics,
  testGeneratePlayerIdWithNullStorage,
  type MultiplayerDiagnostics,
  type GeneratePlayerIdTestResult,
} from '@/hooks/useMultiplayer';

// Floating QA & Diagnostic panel showing SDK lifecycle, multiplayer telemetry, and storage resilience.
// Toggle with the 🐞 button; hidden by default.
const DebugPanel: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { lang } = useTranslations();
  const [, setTick] = useState(0);
  const [smoke, setSmoke] = useState<any>(typeof window !== 'undefined' ? (window as any).__ytSmokeTest : null);
  const [mpDiag, setMpDiag] = useState<MultiplayerDiagnostics>(getMultiplayerDiagnostics());
  const [harnessResult, setHarnessResult] = useState<GeneratePlayerIdTestResult | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setTick(t => t + 1);
      setMpDiag(getMultiplayerDiagnostics());
    }, 1000);

    const onSmoke = (e: Event) => setSmoke((e as CustomEvent).detail);
    const onAd = () => setTick(t => t + 1);
    const onMp = (e: Event) => setMpDiag((e as CustomEvent).detail);
    const onHealth = () => setTick(t => t + 1);

    window.addEventListener('ytgame:smoketest', onSmoke);
    window.addEventListener('ytgame:adevent', onAd);
    window.addEventListener('ytgame:multiplayer', onMp);
    window.addEventListener('ytgame:healthevent', onHealth);

    return () => {
      clearInterval(id);
      window.removeEventListener('ytgame:smoketest', onSmoke);
      window.removeEventListener('ytgame:adevent', onAd);
      window.removeEventListener('ytgame:multiplayer', onMp);
      window.removeEventListener('ytgame:healthevent', onHealth);
    };
  }, [open]);

  if (!open) return null;

  const lastAd: AdEvent | null = getLastAdEvent();
  const lastScore = getLastSentScore();
  const grants = grantSummary();
  const adLog = getAdEventLog().slice(-5).reverse();
  const lastHealth: HealthLogEntry | null = getLastHealthEvent();
  const healthList = getHealthLog().slice(-3).reverse();

  const dot = (ok: boolean) => (
    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${ok ? 'bg-green-400' : 'bg-red-400'}`} />
  );

  const warnDot = (
    <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-amber-400" />
  );

  const runNullStorageHarness = () => {
    const res = testGeneratePlayerIdWithNullStorage();
    setHarnessResult(res);
    setMpDiag(getMultiplayerDiagnostics());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-88 max-w-[calc(100vw-2rem)] rounded-2xl bg-black/90 text-white text-xs font-mono shadow-2xl border border-white/15 backdrop-blur-md">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-white/5 rounded-t-2xl">
        <span className="font-semibold flex items-center gap-1.5">
          <span>🐞</span>
          <span>Playables & Multiplayer Debug</span>
        </span>
        <button onClick={onClose} aria-label="Close debug panel" className="opacity-70 hover:opacity-100 p-1 text-sm">✕</button>
      </div>

      <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto">
        {/* Multiplayer & Storage Diagnostics */}
        <section className="bg-white/5 p-2.5 rounded-xl border border-white/10">
          <div className="font-semibold text-primary mb-1.5 flex items-center justify-between">
            <span>Multiplayer & Storage</span>
            <span className="text-[10px] text-white/50">{mpDiag.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          <div>
            {dot(mpDiag.sessionStatus !== 'error')}
            <span className="opacity-70">Status: </span>
            <span className="font-bold uppercase text-white">{mpDiag.sessionStatus}</span>
            {mpDiag.roomCode && <span className="opacity-70"> ({mpDiag.roomCode})</span>}
          </div>

          <div>
            {mpDiag.playerIdSource === 'sessionStorage' ? dot(true) : warnDot}
            <span className="opacity-70">Player ID Source: </span>
            <span className={`font-semibold ${mpDiag.playerIdSource === 'sessionStorage' ? 'text-green-300' : 'text-amber-300'}`}>
              {mpDiag.playerIdSource}
            </span>
            {mpDiag.playerIdSource === 'memory' && (
              <span className="opacity-60 text-[10px] block pl-3.5">
                ↳ In-memory fallback (sandbox safe)
              </span>
            )}
          </div>

          <div className="truncate">
            <span className="opacity-70 pl-3.5">ID: </span>
            <span className="text-[11px] opacity-90">{mpDiag.playerId || 'generating...'}</span>
          </div>

          <div className="mt-1 pt-1 border-t border-white/10">
            {mpDiag.lastSyncError ? dot(false) : dot(true)}
            <span className="opacity-70">Last Sync Error: </span>
            {mpDiag.lastSyncError ? (
              <div className="text-red-400 pl-3.5 break-words text-[11px] mt-0.5">
                {mpDiag.lastSyncError}
                {mpDiag.lastSyncTimestamp && (
                  <div className="opacity-60 text-[10px]">
                    {new Date(mpDiag.lastSyncTimestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-green-400">none</span>
            )}
          </div>

          {/* Dev Harness Action */}
          <div className="mt-2.5 pt-2 border-t border-white/10">
            <button
              onClick={runNullStorageHarness}
              className="w-full py-1.5 px-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary-foreground text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🧪</span>
              <span>Test null sessionStorage harness</span>
            </button>

            {harnessResult && (
              <div className={`mt-1.5 p-1.5 rounded text-[10px] ${harnessResult.ok ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                <div>{harnessResult.ok ? '✓ Test Passed' : '✗ Test Failed'}</div>
                <div className="opacity-80">Source: {harnessResult.source} · Cached: {String(harnessResult.cachedConsistently)}</div>
                <div className="opacity-70 truncate">ID: {harnessResult.playerId}</div>
              </div>
            )}
          </div>
        </section>

        {/* Health Logging Section */}
        {healthList.length > 0 && (
          <section className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            <div className="font-semibold text-red-400 mb-1 flex items-center justify-between">
              <span>ytgame.health Events</span>
              <span className="text-[10px] opacity-60">Last {healthList.length}</span>
            </div>
            <div className="space-y-1">
              {healthList.map(h => (
                <div key={h.id} className="text-[10px] border-b border-white/5 pb-1 last:border-none">
                  <div className="flex items-center justify-between">
                    <span className={h.level === 'error' ? 'text-red-400 font-semibold' : 'text-amber-400 font-semibold'}>
                      {h.type}
                    </span>
                    <span className="opacity-50">{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="opacity-80 truncate">{h.message}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* YouTube Playables SDK Lifecycle */}
        <section>
          <div className="opacity-60 mb-1">Playables Lifecycle</div>
          <div>{dot(inPlayables())}IN_PLAYABLES_ENV: {String(inPlayables())}</div>
          <div>{dot(lifecycle.firstFrameSent)}firstFrameReady</div>
          <div>{dot(lifecycle.gameReadySent)}gameReady</div>
          {smoke && <div>{dot(!!smoke.ok)}smokeTest {smoke.ok ? 'ok' : 'fail'}</div>}
        </section>

        <section>
          <div className="opacity-60 mb-1">Language</div>
          <div>{lang}</div>
        </section>

        <section>
          <div className="opacity-60 mb-1">Last sendScore</div>
          {lastScore ? (
            <div>
              {dot(lastScore.verified)}value={lastScore.value} · {lastScore.verified ? 'verified' : 'MISMATCH'}
              <div className="opacity-60">{new Date(lastScore.timestamp).toLocaleTimeString()}</div>
            </div>
          ) : <div className="opacity-60">none</div>}
        </section>

        <section>
          <div className="opacity-60 mb-1">Last ad event</div>
          {lastAd ? (
            <div>
              {dot(lastAd.outcome === 'GRANTED')}{lastAd.outcome} (code {lastAd.code})
              <div className="opacity-60">{lastAd.rewardId} · {new Date(lastAd.timestamp).toLocaleTimeString()}</div>
              {lastAd.detail && <div className="opacity-60">↳ {lastAd.detail}</div>}
            </div>
          ) : <div className="opacity-60">none</div>}
        </section>

        <section>
          <div className="opacity-60 mb-1">Grants</div>
          <div>total={grants.total} · applied={grants.applied} · pending={grants.pending}</div>
        </section>

        {adLog.length > 0 && (
          <section>
            <div className="opacity-60 mb-1">Ad log (last {adLog.length})</div>
            {adLog.map(e => (
              <div key={e.timestamp} className="truncate">
                {new Date(e.timestamp).toLocaleTimeString()} · {e.outcome}{e.attempt ? ` #${e.attempt}` : ''}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;
