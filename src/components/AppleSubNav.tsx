import React from 'react';
import { BookOpen, Clock, RotateCcw } from 'lucide-react';

export type SubNavTab = 'game' | 'heritage' | 'typesafe';

interface AppleSubNavProps {
  activeTab?: SubNavTab;
  onSelectTab?: (tab: SubNavTab) => void;
  onNewGame: () => void;
  isPlaying: boolean;
  onOpenRules: () => void;
  onToggleHistory: () => void;
}

export const AppleSubNav: React.FC<AppleSubNavProps> = ({
  onNewGame,
  isPlaying,
  onOpenRules,
  onToggleHistory,
}) => {
  return (
    <div className="sticky top-[44px] z-40 w-full h-[52px] apple-glass border-b border-black/5 dark:border-white/10 select-none">
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Game Title */}
        <div className="flex items-center gap-3">
          <span className="text-[20px] sm:text-[21px] font-semibold text-foreground tracking-[-0.231px]">
            Ludo & Friends
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            title="Read Game Rules"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
            title="Toggle Turn History"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log</span>
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
              <span>New Game</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppleSubNav;
