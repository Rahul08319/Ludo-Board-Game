import React from 'react';
import { WifiOff, ShieldAlert, Users, Sparkles, RotateCcw, Bug, ArrowLeft } from 'lucide-react';
import { getMultiplayerDiagnostics } from '@/hooks/useMultiplayer';

interface MultiplayerFallbackScreenProps {
  error?: string | null;
  onRetry?: () => void;
  onBack: () => void;
  onStartPassAndPlay?: () => void;
  onStartSoloAI?: () => void;
  onOpenDebug?: () => void;
}

export const MultiplayerFallbackScreen: React.FC<MultiplayerFallbackScreenProps> = ({
  error,
  onRetry,
  onBack,
  onStartPassAndPlay,
  onStartSoloAI,
  onOpenDebug,
}) => {
  const diag = getMultiplayerDiagnostics();
  const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-[28px] apple-glass border border-black/10 dark:border-white/10 apple-elevation text-center select-none animate-apple-spring">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-sm">
        <WifiOff className="w-8 h-8" />
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">
        Online Multiplayer Unavailable
      </h2>

      {/* Description */}
      <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
        {isOffline
          ? 'Your device appears to be offline. Online room matchmaking requires an active internet connection.'
          : error
          ? error
          : 'Unable to connect to the online matchmaking service. This may occur in sandboxed embedded frames, restricted network environments, or during temporary maintenance.'}
      </p>

      {/* Diagnostic Context Pills */}
      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-6 text-left space-y-2 text-[12px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Network Status:</span>
          <span className={`font-semibold ${isOffline ? 'text-red-400' : 'text-green-400'}`}>
            {isOffline ? 'Offline' : 'Connected'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Storage Mode:</span>
          <span className="font-semibold text-foreground">
            {diag.storageAccessible ? 'sessionStorage Active' : 'In-Memory Fallback (Sandbox Protected)'}
          </span>
        </div>

        {diag.lastSyncError && (
          <div className="pt-2 border-t border-black/10 dark:border-white/10">
            <span className="text-[11px] text-muted-foreground block mb-0.5">Diagnostic Error:</span>
            <span className="text-[11px] text-red-400 font-mono break-words">
              {diag.lastSyncError}
            </span>
          </div>
        )}
      </div>

      {/* Recommended Alternatives */}
      <div className="space-y-2.5 mb-5">
        {onStartPassAndPlay && (
          <button
            onClick={onStartPassAndPlay}
            className="w-full apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center justify-center gap-2 text-[15px] shadow-sm py-3"
          >
            <Users className="w-4 h-4" />
            <span>Play Local Pass & Play (2–4 Players)</span>
          </button>
        )}

        {onStartSoloAI && (
          <button
            onClick={onStartSoloAI}
            className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/15 text-[14px] font-semibold text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Play Solo vs TypeSafe AI</span>
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2.5 rounded-full bg-black/5 dark:bg-white/10 text-[13px] font-medium text-foreground hover:bg-black/10 dark:hover:bg-white/15 transition-colors apple-press flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>

      {/* Footer Utility Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 text-[13px]">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Menu</span>
        </button>

        {onOpenDebug && (
          <button
            onClick={onOpenDebug}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Inspect Diagnostics</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiplayerFallbackScreen;
