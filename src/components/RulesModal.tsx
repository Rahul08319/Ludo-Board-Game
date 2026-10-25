import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, Target, Dices, Skull, Shield, Trophy } from 'lucide-react';

interface RulesModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ trigger, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 select-none">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[#0066cc] dark:text-[#2997ff] text-[13px] font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Classic Rulebook</span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Official Rules of Ludo
          </DialogTitle>
          <p className="text-[13px] text-muted-foreground">
            Classic 2008 ANYPLAYS mechanics ported to Apple Design specifications.
          </p>
        </DialogHeader>

        <div className="space-y-4 text-[14px] text-foreground/90 mt-3">
          <section className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <h3 className="font-semibold text-[15px] text-foreground mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Objective</span>
            </h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Navigate all 4 of your counters from your home yard around the 52-cell outer track and up your colored home corridor into the center victory goal. First player with all 4 tokens home wins!
            </p>
          </section>

          <section className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <h3 className="font-semibold text-[15px] text-foreground mb-1 flex items-center gap-2">
              <Dices className="w-4 h-4 text-purple-500" />
              <span>Rolling & Movement</span>
            </h3>
            <ul className="text-[13px] text-muted-foreground space-y-1 list-disc pl-5">
              <li>Roll a <strong>5</strong> to deploy a counter from your home yard onto your start cell.</li>
              <li>Roll a <strong>6</strong> to earn an immediate extra turn.</li>
              <li><strong>Penalty:</strong> Rolling three consecutive sixes sends your last moved counter immediately back to home!</li>
            </ul>
          </section>

          <section className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <h3 className="font-semibold text-[15px] text-foreground mb-1 flex items-center gap-2">
              <Skull className="w-4 h-4 text-red-500" />
              <span>Elimination & +20 Bonus Stride</span>
            </h3>
            <ul className="text-[13px] text-muted-foreground space-y-1 list-disc pl-5">
              <li>Landing on a cell with an opposing single counter kills it, returning it to home yard.</li>
              <li>Each elimination awards an instant <strong>20-cell bonus advance</strong> to any of your tokens.</li>
              <li>Safe cells (marked with a star ★) cannot be attacked.</li>
            </ul>
          </section>

          <section className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <h3 className="font-semibold text-[15px] text-foreground mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Blockades & Walls</span>
            </h3>
            <ul className="text-[13px] text-muted-foreground space-y-1 list-disc pl-5">
              <li>Two counters of the same color on a single cell create an impassable <strong>wall</strong>.</li>
              <li>No counter may jump or bypass an active wall.</li>
              <li>If you roll a 6 and maintain an active wall, you must break it!</li>
            </ul>
          </section>

          <section className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <h3 className="font-semibold text-[15px] text-foreground mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Exact Goal & +10 Bonus</span>
            </h3>
            <ul className="text-[13px] text-muted-foreground space-y-1 list-disc pl-5">
              <li>Entering the center victory cell requires the <strong>exact roll</strong>.</li>
              <li>Reaching the goal grants an immediate <strong>10-cell bonus stride</strong> to another token.</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesModal;
