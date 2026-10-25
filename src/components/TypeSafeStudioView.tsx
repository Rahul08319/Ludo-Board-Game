import React, { useState } from 'react';
import {
  evaluateLudoMoveSystemOne,
  evaluateChatSystemOne,
  type StrategicRoute,
  type TypeSafeEvaluationRouting,
} from '@/lib/typeSafeAI';
import { createInitialState } from '@/lib/ludoGame';
import { Sparkles, Route, Cpu, Shield, Zap, Terminal, CheckCircle2, Play } from 'lucide-react';

export const TypeSafeStudioView: React.FC = () => {
  const [testDice, setTestDice] = useState(5);
  const [testScenario, setTestScenario] = useState<'yard_exit' | 'kill_opportunity' | 'wall_block' | 'goal_rush'>('yard_exit');
  const [chatInput, setChatInput] = useState('Nice move! That was a close game.');
  const [chatSender, setChatSender] = useState('Player 1');

  // Generate test state based on scenario
  const getScenarioState = () => {
    const state = createInitialState([
      { color: 'red', type: 'human' },
      { color: 'blue', type: 'cpu' },
      { color: 'yellow', type: 'cpu' },
      { color: 'green', type: 'cpu' },
    ]);
    state.diceValue = testDice;

    if (testScenario === 'yard_exit') {
      // Tokens in home yard, roll 5 to exit
      state.diceValue = 5;
    } else if (testScenario === 'kill_opportunity') {
      state.diceValue = 3;
      state.players[0].tokens[0].isHome = false;
      state.players[0].tokens[0].position = 4;
      state.players[0].tokens[0].globalPosition = 4;

      // Enemy at cell 7 (relative to blue: (7 - 13 + 52) % 52 = 46)
      state.players[1].tokens[0].isHome = false;
      state.players[1].tokens[0].position = 46;
      state.players[1].tokens[0].globalPosition = 7;
    } else if (testScenario === 'wall_block') {
      state.diceValue = 4;
      state.players[0].tokens[0].isHome = false;
      state.players[0].tokens[0].position = 10;
      state.players[0].tokens[0].globalPosition = 10;

      // Red token 1 is at 14 (destination) -> forms wall!
      state.players[0].tokens[1].isHome = false;
      state.players[0].tokens[1].position = 14;
      state.players[0].tokens[1].globalPosition = 14;
    } else if (testScenario === 'goal_rush') {
      state.diceValue = 2;
      state.players[0].tokens[0].isHome = false;
      state.players[0].tokens[0].position = 55; // 55 + 2 = 57 (exact goal!)
      state.players[0].tokens[0].globalPosition = -1;
    }

    return state;
  };

  const sampleState = getScenarioState();
  const evaluation = evaluateLudoMoveSystemOne(sampleState, [0, 1]);
  const chatEvaluation = evaluateChatSystemOne(chatInput, chatSender);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-apple-spring">
      {/* Hero Section */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] text-[12px] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TypeSafe Intelligence Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          System One Evaluation & Routing Pattern
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          TypeSafe models like <strong>Jev</strong> supply small, typed judgments and probabilities that deterministic code composes into rich game intelligence.
        </p>
      </div>

      {/* The 3 Primitives Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl apple-glass border border-black/10 dark:border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center font-bold text-sm">
            C
          </div>
          <h3 className="text-[16px] font-semibold text-foreground">Choice Primitive</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Selects one bounded strategy from a defined set: <code>OFFENSIVE_STRIKE</code>, <code>GOAL_RUSH</code>, <code>SANCTUARY_RETREAT</code>, <code>FORTIFY_WALL</code>, or <code>MOBILIZE_RESERVE</code>, with calibrated probability distribution.
          </p>
        </div>

        <div className="p-5 rounded-2xl apple-glass border border-black/10 dark:border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
            S
          </div>
          <h3 className="text-[16px] font-semibold text-foreground">Score Primitive</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Measures degree along ordered dimensions: Risk Exposure (1: Negligible to 5: Critical) and Match Tension (Levels 1 to 5), allowing dynamic thresholding.
          </p>
        </div>

        <div className="p-5 rounded-2xl apple-glass border border-black/10 dark:border-white/10 space-y-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
            N
          </div>
          <h3 className="text-[16px] font-semibold text-foreground">Noul Primitive</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Returns calibrated probability of whether a condition holds: <code>is_kill_opportunity</code>, <code>is_safe_refuge</code>, or <code>is_wall_formation</code>.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Bench */}
      <div className="rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Live Decision Pipeline Simulator</span>
            </h3>
            <p className="text-[13px] text-muted-foreground">
              Select a board scenario to watch the TypeSafe System One evaluator route the optimal move.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap gap-1.5 bg-black/5 dark:bg-white/10 p-1 rounded-full text-[12px]">
            <button
              onClick={() => setTestScenario('yard_exit')}
              className={`px-3 py-1 rounded-full transition-all apple-press ${
                testScenario === 'yard_exit'
                  ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yard Exit (Roll 5)
            </button>
            <button
              onClick={() => setTestScenario('kill_opportunity')}
              className={`px-3 py-1 rounded-full transition-all apple-press ${
                testScenario === 'kill_opportunity'
                  ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Kill Strike (+20)
            </button>
            <button
              onClick={() => setTestScenario('wall_block')}
              className={`px-3 py-1 rounded-full transition-all apple-press ${
                testScenario === 'wall_block'
                  ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Wall Formation
            </button>
            <button
              onClick={() => setTestScenario('goal_rush')}
              className={`px-3 py-1 rounded-full transition-all apple-press ${
                testScenario === 'goal_rush'
                  ? 'bg-white dark:bg-[#272729] text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Goal Rush (+10)
            </button>
          </div>
        </div>

        {/* Live Output Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tactical Advice & Routing Result */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0066cc]/10 to-transparent dark:from-[#2997ff]/15 border border-[#0066cc]/20">
              <span className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider block mb-1">
                Routed Action
              </span>
              <p className="text-[15px] font-semibold text-foreground leading-snug">
                {evaluation.tacticalAdvice}
              </p>
              <div className="flex items-center gap-4 mt-3 text-[12px] text-muted-foreground">
                <span>
                  Strategy: <strong className="text-foreground">{evaluation.routedStrategy.selected}</strong>
                </span>
                <span>
                  Confidence: <strong className="text-foreground">{(evaluation.confidence * 100).toFixed(0)}%</strong>
                </span>
              </div>
            </div>

            {/* Candidates comparison */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                Evaluated Candidates
              </h4>
              {evaluation.candidates.map(c => (
                <div
                  key={c.tokenId}
                  className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[12px] font-bold">
                      #{c.tokenId + 1}
                    </span>
                    <div>
                      <strong className="text-[13px] text-foreground block">
                        {c.isHome ? 'Base Departure' : `Advance to ${c.newPosition}`}
                      </strong>
                      <span className="text-[11px] text-muted-foreground">
                        {c.strategicRoute}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[12px] font-bold text-foreground">
                      Utility {c.compositeUtility.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      Risk {c.counterThreatRisk.level}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TypeSafe JSON Telemetry */}
          <div className="bg-black/90 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-auto max-h-[380px] border border-white/10">
            <div className="flex items-center justify-between mb-2 text-white/50 text-[10px] uppercase tracking-wider">
              <span>Telemetry: TypeSafe Jev System One</span>
              <span>200 OK</span>
            </div>
            <pre>{JSON.stringify(evaluation, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Social & Chat Moderation Evaluator */}
      <div className="rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation space-y-4">
        <h3 className="text-[18px] font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Multiplayer Chat Intent & Safety Classifier</span>
        </h3>
        <p className="text-[13px] text-muted-foreground">
          Classifies intent (Sportsmanship, Taunt, Strategy) and flags toxic communications in zero latency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-[12px] font-semibold text-muted-foreground">Sample Message:</label>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-[14px] text-foreground focus:outline-none focus:border-[#0066cc]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted-foreground uppercase block font-semibold">Intent</span>
              <strong className="text-[14px] text-foreground">{chatEvaluation.intent.selected}</strong>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground uppercase block font-semibold">Moderation</span>
              <span className={`text-[12px] font-semibold ${chatEvaluation.requiresModeration.holds ? 'text-red-500' : 'text-emerald-500'}`}>
                {chatEvaluation.requiresModeration.holds ? 'Flagged (Toxic)' : 'Safe (Clean)'}
              </span>
            </div>
            <div className="text-2xl">{chatEvaluation.suggestedReaction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeSafeStudioView;
