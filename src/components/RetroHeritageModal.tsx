import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield, Sparkles, Award, Music, Gamepad2, History } from 'lucide-react';

interface RetroHeritageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RetroHeritageModal: React.FC<RetroHeritageModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 select-none">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-[#0066cc] dark:text-[#2997ff] text-[13px] font-semibold">
            <History className="w-4 h-4" />
            <span>Classic Heritage Archive</span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Ludo & Friends (2008 J2ME Edition)
          </DialogTitle>
          <p className="text-[14px] text-muted-foreground">
            Preserving the legendary Java ME mobile classic by ANYPLAYS™ and Movilenio Servicios Móviles.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4 text-[14px] text-foreground/90">
          {/* Historical Showcase Card */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/retro-icon.png"
              alt="Retro J2ME Icon"
              className="w-16 h-16 rounded-2xl bg-black/40 p-1 shadow-md object-contain shrink-0"
              onError={(e) => {
                // fallback if image not directly rendered
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-semibold text-foreground text-[16px]">
                Original 2008 J2ME Release
              </h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Before modern smartphones, millions played <em>Ludo & Friends</em> on Nokia Symbian, Sony Ericsson, and BlackBerry devices. We have faithfully preserved its core mechanics and mathematical rulebook.
              </p>
            </div>
          </div>

          {/* Original 4 Character Classes */}
          <div>
            <h4 className="text-[15px] font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Original Character Classes (Fantasy Board)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Paladin', color: 'Red', avatar: '🦁', desc: 'Courageous vanguard' },
                { name: 'Knight', color: 'Blue', avatar: '🐲', desc: 'Fortified tactician' },
                { name: 'Wizard', color: 'Green', avatar: '🧙', desc: 'Mystic strategist' },
                { name: 'Orc', color: 'Yellow', avatar: '🦊', desc: 'Fierce conqueror' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center"
                >
                  <span className="text-2xl block mb-1">{c.avatar}</span>
                  <strong className="block text-[13px] text-foreground">{c.name}</strong>
                  <span className="text-[11px] text-muted-foreground block">{c.color} Player</span>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Original Rules Matrix */}
          <div>
            <h4 className="text-[15px] font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Classic Rulebook Authenticity</span>
            </h4>
            <div className="space-y-2 text-[13px]">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-start gap-3">
                <span className="font-bold text-[#0066cc] dark:text-[#2997ff] shrink-0 font-mono">01</span>
                <div>
                  <strong className="text-foreground">Roll 5 to Leave Yard:</strong> Counters must roll exactly a 5 to emerge from home base onto the starting tile.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-start gap-3">
                <span className="font-bold text-[#0066cc] dark:text-[#2997ff] shrink-0 font-mono">02</span>
                <div>
                  <strong className="text-foreground">Impassable Walls (Blockades):</strong> Two counters of the same color on a cell form a wall. No counter may jump or pass through a wall. Rolling a 6 forces you to break your wall!
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-start gap-3">
                <span className="font-bold text-[#0066cc] dark:text-[#2997ff] shrink-0 font-mono">03</span>
                <div>
                  <strong className="text-foreground">+20 Bonus Advance on Elimination:</strong> Landing on an enemy counter sends them home and immediately awards a 20-cell bonus advance to any of your tokens.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-start gap-3">
                <span className="font-bold text-[#0066cc] dark:text-[#2997ff] shrink-0 font-mono">04</span>
                <div>
                  <strong className="text-foreground">+10 Bonus Advance on Goal Arrival:</strong> Reaching the exact center goal grants an immediate 10-cell bonus stride.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-start gap-3">
                <span className="font-bold text-[#0066cc] dark:text-[#2997ff] shrink-0 font-mono">05</span>
                <div>
                  <strong className="text-foreground">Triple 6 Penalty:</strong> Rolling three consecutive sixes returns your last moved counter directly back home!
                </div>
              </div>
            </div>
          </div>

          {/* Credits to Original Creators */}
          <div className="pt-4 border-t border-black/10 dark:border-white/10">
            <h4 className="text-[14px] font-semibold text-foreground mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Original J2ME Credits (2008)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px] text-muted-foreground">
              <div>
                <span className="block font-semibold text-foreground">Software</span>
                Iñaki Segrelles
              </div>
              <div>
                <span className="block font-semibold text-foreground">Graphics</span>
                Pablo Sánchez
              </div>
              <div>
                <span className="block font-semibold text-foreground">Music & Sound</span>
                José Vázquez
              </div>
              <div>
                <span className="block font-semibold text-foreground">Quality Assurance</span>
                José Jimeno
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-3">
              Anyplays is a trademark (TM) of Movilenio Servicios Móviles S.L. (c) 2008. Re-engineered in 2026 with Apple Fluid Design & TypeSafe System One AI.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RetroHeritageModal;
