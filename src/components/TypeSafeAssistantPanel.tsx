import React, { useState } from 'react';
import type { TypeSafeEvaluationRouting, EvaluatedMoveCandidate } from '@/lib/typeSafeAI';
import { Sparkles, ShieldAlert, ShieldCheck, Zap, ChevronRight, Code2, ArrowUpRight } from 'lucide-react';

interface TypeSafeAssistantPanelProps {
  evaluation: TypeSafeEvaluationRouting | null;
  onSelectToken?: (tokenId: number) => void;
  isHumanTurn: boolean;
  canRoll: boolean;
}

export const TypeSafeAssistantPanel: React.FC<TypeSafeAssistantPanelProps> = ({
  evaluation,
  onSelectToken,
  isHumanTurn,
  canRoll,
}) => {
  const [showJson, setShowJson] = useState(false);

  if (!evaluation) {
    return (
      <div className="w-full max-w-[360px] p-5 rounded-[22px] apple-glass border border-black/10 dark:border-white/10 text-center select-none animate-apple-spring">
        <div className="flex items-center justify-center gap-2 mb-2 text-[#0066cc] dark:text-[#2997ff]">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <h3 className="text-[17px] font-semibold tracking-tight">TypeSafe Intelligence</h3>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Roll the dice to initialize TypeSafe System One Jev evaluation telemetry.
        </p>
      </div>
    );
  }

  const { routedStrategy, boardTension, candidates, tacticalAdvice, confidence, recommendedTokenId } = evaluation;

  // Color mapping for threat level
  const threatBadge = (level: number) => {
    switch (level) {
      case 5:
        return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
      case 4:
        return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 3:
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 2:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="w-full max-w-[380px] rounded-[24px] apple-glass border border-black/10 dark:border-white/10 p-5 shadow-apple-subtle select-none flex flex-col gap-4 animate-apple-spring">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0066cc]/10 dark:bg-[#2997ff]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold tracking-tight text-foreground leading-none">
                TypeSafe System One
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff]">
                Jev v1
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Real-time strategic judgment & routing
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowJson(!showJson)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors apple-press"
          title="Inspect Raw System One JSON"
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>

      {/* Raw JSON View if opened */}
      {showJson ? (
        <div className="bg-black/80 dark:bg-black/90 text-emerald-400 p-3 rounded-xl text-[10px] font-mono overflow-auto max-h-[300px] border border-white/10">
          <pre>{JSON.stringify(evaluation, null, 2)}</pre>
        </div>
      ) : (
        <>
          {/* Tactical Advice Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0066cc]/10 to-transparent dark:from-[#2997ff]/15 border border-[#0066cc]/20">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-foreground leading-snug">
                  {tacticalAdvice}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span>
                    Route: <strong className="text-foreground">{routedStrategy.selected}</strong>
                  </span>
                  <span>
                    Confidence: <strong className="text-foreground">{(confidence * 100).toFixed(0)}%</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            {/* Strategy Choice */}
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold mb-1">
                Strategic Route
              </span>
              <span className="font-semibold text-foreground text-[12px] truncate block">
                {routedStrategy.selected.replace('_', ' ')}
              </span>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#0066cc] dark:bg-[#2997ff] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(confidence * 100)}%` }}
                />
              </div>
            </div>

            {/* Match Tension Score */}
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-semibold mb-1">
                Board Tension
              </span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-[12px]">
                  Level {boardTension.level} ({boardTension.label})
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden flex gap-0.5">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div
                    key={lvl}
                    className={`flex-1 h-full rounded-full ${
                      lvl <= boardTension.level
                        ? boardTension.level >= 4
                          ? 'bg-red-500'
                          : boardTension.level >= 3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                        : 'bg-black/10 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Candidate Tokens Reranking */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Candidate Choices ({candidates.length})
              </span>
              <span className="text-[10px] text-muted-foreground">Ranked by Utility</span>
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {candidates.map((cand, idx) => {
                const isTop = cand.tokenId === recommendedTokenId;
                return (
                  <button
                    key={cand.tokenId}
                    onClick={() => onSelectToken && onSelectToken(cand.tokenId)}
                    disabled={!isHumanTurn}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all apple-press ${
                      isTop
                        ? 'bg-[#0066cc]/10 dark:bg-[#2997ff]/20 border border-[#0066cc]/30 shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10'
                    } ${!isHumanTurn ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                          isTop
                            ? 'bg-[#0066cc] text-white shadow-sm'
                            : 'bg-black/10 dark:bg-white/10 text-muted-foreground'
                        }`}
                      >
                        #{cand.tokenId + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-foreground">
                            {cand.isHome ? 'Deploy Base' : `Step to ${cand.newPosition}`}
                          </span>
                          {cand.killPotential.holds && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-semibold">
                              +20 Kill
                            </span>
                          )}
                          {cand.isGoal && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
                              +10 Goal
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {cand.strategicRoute.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${threatBadge(
                          cand.counterThreatRisk.level
                        )}`}
                        title={cand.counterThreatRisk.explanation}
                      >
                        Risk {cand.counterThreatRisk.level}/5
                      </span>
                      {isHumanTurn && isTop && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TypeSafeAssistantPanel;
