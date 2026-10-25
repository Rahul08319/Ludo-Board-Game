import React from 'react';
import { Play, Sparkles, BookOpen, Clock, RotateCcw } from 'lucide-react';

export type SubNavTab = 'game' | 'heritage' | 'typesafe';

interface AppleSubNavProps {
  activeTab: SubNavTab;
  onSelectTab: (tab: SubNavTab) => void;
  onNewGame: () => void;
  isPlaying: boolean;
  onOpenRules: () => void;
  onToggleHistory: () => void;
}

export const AppleSubNav: React.FC<AppleSubNavProps> = ({
  activeTab,
  onSelectTab,
  onNewGame,
  isPlaying,
  onOpenRules,
  onToggleHistory,
}) => {
  return (
    <div className="sticky top-[44px] z-40 w-full h-[52px] apple-glass border-b border-black/5 dark:border-white/10 select-none">
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Product title in SF Pro Display (21px, 600, tight tracking) */}
        <div className="flex items-center gap-3">
          <span className="text-[20px] sm:text-[21px] font-semibold text-foreground tracking-[-0.231px]">
            Ludo & Friends
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground">
            Apple Edition
          </span>
        </div>

        {/* Center: Segmented Navigation Pills */}
        <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full text-[13px] font-medium">
          <button
            onClick={() => onSelectTab('game')}
            className={`px-3 py-1 rounded-full transition-all apple-press ${
              activeTab === 'game'
                ? 'bg-white dark:bg-[#272729] text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Board Game
          </button>
          <button
            onClick={() => onSelectTab('typesafe')}
            className={`px-3 py-1 rounded-full transition-all apple-press flex items-center gap-1 ${
              activeTab === 'typesafe'
                ? 'bg-white dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
            <span>TypeSafe AI</span>
          </button>
          <button
            onClick={() => onSelectTab('heritage')}
            className={`px-3 py-1 rounded-full transition-all apple-press hidden xs:flex items-center gap-1 ${
              activeTab === 'heritage'
                ? 'bg-white dark:bg-[#272729] text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>J2ME Heritage</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRules}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            title="Read Game Rules"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rules</span>
          </button>

          <button
            onClick={onToggleHistory}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            title="Toggle Turn History"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>

          {/* Primary Action Blue Pill CTA */}
          <button
            onClick={onNewGame}
            className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center gap-1.5 text-[13px] sm:text-[14px]"
            title={isPlaying ? 'Reset Game Setup' : 'Start Game'}
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Match</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Match</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppleSubNav;
