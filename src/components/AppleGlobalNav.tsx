import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Github } from 'lucide-react';

export type AppTheme = 'studio' | 'ceramic' | 'oled' | 'wood';

interface AppleGlobalNavProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
}

export const AppleGlobalNav: React.FC<AppleGlobalNavProps> = ({
  currentTheme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full h-[44px] bg-[#000000] text-white/90 text-[12px] font-normal tracking-[-0.12px] select-none border-b border-white/10">
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Apple Brand + Core Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="/"
            className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors apple-press"
            title="Ludo & Friends Pro"
          >
            <span className="text-[17px] font-semibold leading-none"></span>
            <span className="font-semibold tracking-tight text-[13px]">Ludo Pro</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors"
            >
              Game Stage
            </button>
            <button
              onClick={onOpenRules}
              className="hover:text-white transition-colors"
            >
              Classic Rules
            </button>
          </nav>
        </div>

        {/* Right: Controls & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Pill */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/10">
            <button
              onClick={() => onThemeChange(currentTheme === 'studio' ? 'ceramic' : currentTheme === 'ceramic' ? 'oled' : currentTheme === 'oled' ? 'wood' : 'studio')}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white/90 hover:text-white transition-colors flex items-center gap-1"
              title={`Current Theme: ${currentTheme.toUpperCase()} (Click to Cycle)`}
            >
              {currentTheme === 'ceramic' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span className="hidden lg:inline text-[10px]">Ceramic</span>
                </>
              ) : currentTheme === 'oled' ? (
                <>
                  <Moon className="w-3 h-3 text-purple-400" />
                  <span className="hidden lg:inline text-[10px]">OLED</span>
                </>
              ) : currentTheme === 'wood' ? (
                <>
                  <span className="text-[10px]">🪵</span>
                  <span className="hidden lg:inline text-[10px]">Wood</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-blue-400" />
                  <span className="hidden lg:inline text-[10px]">Studio</span>
                </>
              )}
            </button>
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all apple-press"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-white/40" />}
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/Rahul08319/Ludo-Board-Game"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all apple-press"
            title="View on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default AppleGlobalNav;
