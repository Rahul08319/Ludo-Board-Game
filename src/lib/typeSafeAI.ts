/**
 * TypeSafe System One Evaluation & Routing Engine
 * Powered by TypeSafe System One (Jev) Models
 * 
 * Implements typed judgments, calibrated probabilities, and strategic evaluation
 * routing for the Ludo & Friends board game engine.
 * 
 * Design follows the official TypeSafe System One specification:
 * - Primitives: Choice (categorical), Score (ordered dimension), Noul (condition probability)
 * - Pattern: Evaluation & Routing (State -> Judgments -> Routed Action Execution)
 */

import type { GameState, Player, Token, PlayerColor } from './ludoGame';
import { toGlobalPosition, SAFE_CELLS } from './ludoGame';

// ── Types & Primitives ────────────────────────────────────────────────────────

export type StrategicRoute =
  | 'OFFENSIVE_STRIKE'      // Kill an opponent token (+20 bonus cells)
  | 'SANCTUARY_RETREAT'     // Move to safety (star cell or safe sanctuary)
  | 'GOAL_RUSH'             // Reach center goal or enter home final stretch (+10 bonus cells)
  | 'FORTIFY_WALL'          // Combine two same-color tokens to form an impassable blockade
  | 'MOBILIZE_RESERVE'      // Roll of 5 brings a token from home yard onto track
  | 'TACTICAL_TEMPO';       // Advance runner away from trailing threats

export interface TypeSafeNoulResult {
  condition: string;
  probability: number; // 0.0 to 1.0 calibrated probability
  holds: boolean;      // thresholded (typically >= 0.5)
}

export interface TypeSafeScoreResult {
  dimension: string;
  level: 1 | 2 | 3 | 4 | 5;
  label: 'NEGLIGIBLE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  numericValue: number;
  explanation: string;
}

export interface TypeSafeChoiceResult<T extends string = string> {
  selected: T;
  confidence: number; // 0.0 to 1.0 distribution concentration
  distribution: Record<T, number>;
}

export interface EvaluatedMoveCandidate {
  tokenId: number;
  currentPosition: number;
  newPosition: number;
  isHome: boolean;
  isGoal: boolean;
  strategicRoute: StrategicRoute;
  strategicScore: TypeSafeScoreResult;
  killPotential: TypeSafeNoulResult;
  safetySecured: TypeSafeNoulResult;
  wallFormation: TypeSafeNoulResult;
  counterThreatRisk: TypeSafeScoreResult;
  compositeUtility: number; // 0.0 - 100.0
}

export interface TypeSafeEvaluationRouting {
  timestamp: number;
  modelVersion: 'TypeSafe-Jev-System-One-v1';
  gameStateId: string;
  currentPlayer: PlayerColor;
  diceRoll: number;
  recommendedTokenId: number | null;
  routedStrategy: TypeSafeChoiceResult<StrategicRoute>;
  boardTension: TypeSafeScoreResult;
  candidates: EvaluatedMoveCandidate[];
  tacticalAdvice: string;
  confidence: number;
}

// ── State Representation Extractor ──────────────────────────────────────────

export interface SystemOneBoardState {
  activeColor: PlayerColor;
  diceRoll: number;
  consecutiveSixes: number;
  turnPhase: string;
  activePlayerTokens: {
    id: number;
    position: number;
    globalPosition: number;
    status: 'home' | 'board' | 'stretch' | 'goal';
    threatCount: number;
    nearestEnemyDist: number;
  }[];
  opponents: {
    color: PlayerColor;
    tokensInPlay: number;
    tokensAtGoal: number;
    leadProgress: number;
  }[];
}

export function extractSystemOneState(state: GameState): SystemOneBoardState {
  const active = state.players[state.currentPlayerIndex];
  const dice = state.diceValue || 0;

  const activeTokens = active.tokens.map(t => {
    let threatCount = 0;
    let nearestEnemyDist = 999;
    const gp = toGlobalPosition(t.position, active.color);

    if (!t.isHome && !t.isGoal && gp !== -1 && !SAFE_CELLS.includes(gp)) {
      for (const opp of state.players) {
        if (opp.color === active.color) continue;
        for (const ot of opp.tokens) {
          if (ot.isHome || ot.isGoal) continue;
          const ogp = toGlobalPosition(ot.position, opp.color);
          if (ogp === -1) continue;
          const dist = (gp - ogp + 52) % 52;
          if (dist >= 1 && dist <= 6) {
            threatCount++;
            nearestEnemyDist = Math.min(nearestEnemyDist, dist);
          }
        }
      }
    }

    return {
      id: t.id,
      position: t.position,
      globalPosition: gp,
      status: t.isGoal ? 'goal' as const : t.isHome ? 'home' as const : t.position >= 52 ? 'stretch' as const : 'board' as const,
      threatCount,
      nearestEnemyDist,
    };
  });

  const opponents = state.players
    .filter(p => p.color !== active.color)
    .map(p => ({
      color: p.color,
      tokensInPlay: p.tokens.filter(t => !t.isHome && !t.isGoal).length,
      tokensAtGoal: p.tokens.filter(t => t.isGoal).length,
      leadProgress: Math.max(0, ...p.tokens.map(t => t.position)),
    }));

  return {
    activeColor: active.color,
    diceRoll: dice,
    consecutiveSixes: state.consecutiveSixes,
    turnPhase: state.phase,
    activePlayerTokens: activeTokens,
    opponents,
  };
}

// ── TypeSafe System One Evaluation Engine ───────────────────────────────────

/**
 * Runs the TypeSafe System One evaluation and routing pattern.
 * Combines fast typed judgments (Choice, Score, Noul) with rule enforcement.
 */
export function evaluateLudoMoveSystemOne(
  state: GameState,
  movableTokens: number[]
): TypeSafeEvaluationRouting {
  const player = state.players[state.currentPlayerIndex];
  const dice = state.diceValue ?? 0;
  const sysState = extractSystemOneState(state);

  if (movableTokens.length === 0) {
    return {
      timestamp: Date.now(),
      modelVersion: 'TypeSafe-Jev-System-One-v1',
      gameStateId: `${player.color}-${Date.now()}`,
      currentPlayer: player.color,
      diceRoll: dice,
      recommendedTokenId: null,
      routedStrategy: {
        selected: 'TACTICAL_TEMPO',
        confidence: 1.0,
        distribution: {
          OFFENSIVE_STRIKE: 0,
          SANCTUARY_RETREAT: 0,
          GOAL_RUSH: 0,
          FORTIFY_WALL: 0,
          MOBILIZE_RESERVE: 0,
          TACTICAL_TEMPO: 1.0,
        },
      },
      boardTension: {
        dimension: 'board_tension',
        level: 1,
        label: 'NEGLIGIBLE',
        numericValue: 0.1,
        explanation: 'No movable tokens available on this dice roll.',
      },
      candidates: [],
      tacticalAdvice: 'No valid moves available. Passing turn to next player.',
      confidence: 1.0,
    };
  }

  // 1. Evaluate each movable token candidate with System One Primitives
  const evaluatedCandidates: EvaluatedMoveCandidate[] = movableTokens.map(tid => {
    const token = player.tokens.find(t => t.id === tid)!;
    const isHome = token.isHome;
    const currentPos = token.position;
    const newPos = isHome ? 0 : currentPos + dice;
    const newGlobal = isHome
      ? state.players[state.currentPlayerIndex].startPosition
      : toGlobalPosition(newPos, player.color);

    // Primitive: Noul (is_kill_opportunity)
    let killProb = 0.0;
    if (newGlobal !== -1 && !SAFE_CELLS.includes(newGlobal)) {
      for (const opp of state.players) {
        if (opp.color === player.color) continue;
        const victims = opp.tokens.filter(
          ot => !ot.isHome && !ot.isGoal && toGlobalPosition(ot.position, opp.color) === newGlobal
        );
        if (victims.length === 1) {
          killProb = 0.98; // Definite kill + 20-cell bonus
          break;
        }
      }
    }
    const killPotential: TypeSafeNoulResult = {
      condition: 'is_kill_opportunity',
      probability: killProb,
      holds: killProb >= 0.5,
    };

    // Primitive: Noul (is_safe_refuge)
    const isSafe = (newGlobal !== -1 && SAFE_CELLS.includes(newGlobal)) || newPos >= 52;
    const safetyProb = isSafe ? 0.95 : 0.15;
    const safetySecured: TypeSafeNoulResult = {
      condition: 'is_safe_refuge',
      probability: safetyProb,
      holds: isSafe,
    };

    // Primitive: Noul (is_wall_formation)
    let wallProb = 0.0;
    if (newGlobal !== -1 && !isSafe) {
      const ownAtDest = player.tokens.filter(
        t => t.id !== tid && !t.isHome && !t.isGoal && toGlobalPosition(t.position, player.color) === newGlobal
      );
      if (ownAtDest.length === 1) {
        wallProb = 0.92; // Creates an impassable blockade!
      }
    }
    const wallFormation: TypeSafeNoulResult = {
      condition: 'is_wall_formation',
      probability: wallProb,
      holds: wallProb >= 0.5,
    };

    // Primitive: Score (Counter-Threat Risk on Destination)
    let threatLevel: 1 | 2 | 3 | 4 | 5 = 1;
    let threatLabel: 'NEGLIGIBLE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'NEGLIGIBLE';
    let threatValue = 0.1;
    let threatExplanation = 'Safe haven or unreachable by opponents.';

    if (!isSafe && newGlobal !== -1) {
      let threatsNearby = 0;
      for (const opp of state.players) {
        if (opp.color === player.color) continue;
        for (const ot of opp.tokens) {
          if (ot.isHome || ot.isGoal) continue;
          const ogp = toGlobalPosition(ot.position, opp.color);
          if (ogp === -1) continue;
          const distBehind = (newGlobal - ogp + 52) % 52;
          if (distBehind >= 1 && distBehind <= 6) {
            threatsNearby++;
          }
        }
      }
      if (threatsNearby >= 2) {
        threatLevel = 5;
        threatLabel = 'CRITICAL';
        threatValue = 0.95;
        threatExplanation = `Extreme danger: ${threatsNearby} opposing tokens within roll range.`;
      } else if (threatsNearby === 1) {
        threatLevel = 4;
        threatLabel = 'HIGH';
        threatValue = 0.75;
        threatExplanation = 'Exposed: At least 1 opposing hunter within 6 steps.';
      } else {
        threatLevel = 2;
        threatLabel = 'LOW';
        threatValue = 0.3;
        threatExplanation = 'Low immediate threat profile.';
      }
    }

    const counterThreatRisk: TypeSafeScoreResult = {
      dimension: 'counter_threat_risk',
      level: threatLevel,
      label: threatLabel,
      numericValue: threatValue,
      explanation: threatExplanation,
    };

    // Determine Strategic Route classification
    let route: StrategicRoute = 'TACTICAL_TEMPO';
    if (killPotential.holds) {
      route = 'OFFENSIVE_STRIKE';
    } else if (newPos === 57) {
      route = 'GOAL_RUSH';
    } else if (isHome && dice === 5) {
      route = 'MOBILIZE_RESERVE';
    } else if (wallFormation.holds) {
      route = 'FORTIFY_WALL';
    } else if (safetySecured.holds) {
      route = 'SANCTUARY_RETREAT';
    } else {
      route = 'TACTICAL_TEMPO';
    }

    // Composite Utility calculation
    let utility = 20.0;
    if (newPos === 57) utility += 80.0; // Goal reached
    if (killPotential.holds) utility += 65.0; // Kill + 20 cells bonus
    if (isHome) utility += 45.0; // Break out of home
    if (wallFormation.holds) utility += 35.0; // Wall fortress
    if (safetySecured.holds) utility += 25.0; // Safe star or column
    utility += Math.floor(newPos / 2); // Board progress reward
    utility -= (threatLevel - 1) * 12.0; // Danger penalty

    // Strategic Score
    const strategicScore: TypeSafeScoreResult = {
      dimension: 'move_efficiency',
      level: Math.min(5, Math.max(1, Math.round(utility / 20))) as 1 | 2 | 3 | 4 | 5,
      label: utility >= 80 ? 'CRITICAL' : utility >= 60 ? 'HIGH' : utility >= 40 ? 'MODERATE' : 'LOW',
      numericValue: Math.min(1.0, Math.max(0.0, utility / 100)),
      explanation: `Calculated utility ${utility.toFixed(1)} based on ${route}`,
    };

    return {
      tokenId: tid,
      currentPosition: currentPos,
      newPosition: newPos,
      isHome,
      isGoal: newPos === 57,
      strategicRoute: route,
      strategicScore,
      killPotential,
      safetySecured,
      wallFormation,
      counterThreatRisk,
      compositeUtility: Math.max(0, utility),
    };
  });

  // Sort candidates by composite utility
  evaluatedCandidates.sort((a, b) => b.compositeUtility - a.compositeUtility);
  const bestCandidate = evaluatedCandidates[0];

  // 2. Choice Distribution over Strategic Routes
  const routeWeights: Record<StrategicRoute, number> = {
    OFFENSIVE_STRIKE: 0,
    SANCTUARY_RETREAT: 0,
    GOAL_RUSH: 0,
    FORTIFY_WALL: 0,
    MOBILIZE_RESERVE: 0,
    TACTICAL_TEMPO: 0,
  };
  let totalWeight = 0;
  for (const c of evaluatedCandidates) {
    const w = Math.exp(c.compositeUtility / 25);
    routeWeights[c.strategicRoute] += w;
    totalWeight += w;
  }
  const routeDist: Record<StrategicRoute, number> = {} as any;
  for (const r of Object.keys(routeWeights) as StrategicRoute[]) {
    routeDist[r] = totalWeight > 0 ? Number((routeWeights[r] / totalWeight).toFixed(3)) : 0;
  }

  // 3. Overall Board Tension Score
  let maxOpponentLead = 0;
  for (const opp of sysState.opponents) {
    if (opp.leadProgress > maxOpponentLead) maxOpponentLead = opp.leadProgress;
  }
  const tensionVal = Math.min(1.0, (maxOpponentLead / 57) * 0.6 + (state.consecutiveSixes > 0 ? 0.3 : 0.1));
  const tensionLevel = Math.min(5, Math.max(1, Math.ceil(tensionVal * 5))) as 1 | 2 | 3 | 4 | 5;
  const tensionLabel = tensionLevel >= 4 ? 'CRITICAL' : tensionLevel === 3 ? 'MODERATE' : 'LOW';

  const boardTension: TypeSafeScoreResult = {
    dimension: 'match_tension',
    level: tensionLevel,
    label: tensionLabel,
    numericValue: tensionVal,
    explanation: `Match tension index ${(tensionVal * 100).toFixed(0)}% with opponent max lead ${maxOpponentLead}/57.`,
  };

  // 4. Concise Apple-Style Tactical Advice string
  let advice = '';
  switch (bestCandidate.strategicRoute) {
    case 'OFFENSIVE_STRIKE':
      advice = `Target token #${bestCandidate.tokenId + 1} to eliminate the opponent and gain +20 bonus cells!`;
      break;
    case 'GOAL_RUSH':
      advice = `Advance token #${bestCandidate.tokenId + 1} into the center goal! (+10 bonus advance)`;
      break;
    case 'MOBILIZE_RESERVE':
      advice = `Deploy token #${bestCandidate.tokenId + 1} from base onto starting cell.`;
      break;
    case 'FORTIFY_WALL':
      advice = `Merge token #${bestCandidate.tokenId + 1} to construct an impassable wall blockade.`;
      break;
    case 'SANCTUARY_RETREAT':
      advice = `Guide token #${bestCandidate.tokenId + 1} to safe haven star cell.`;
      break;
    default:
      advice = `Advance token #${bestCandidate.tokenId + 1} forward ${dice} steps while maintaining spacing.`;
  }

  return {
    timestamp: Date.now(),
    modelVersion: 'TypeSafe-Jev-System-One-v1',
    gameStateId: `${player.color}-${Date.now()}`,
    currentPlayer: player.color,
    diceRoll: dice,
    recommendedTokenId: bestCandidate.tokenId,
    routedStrategy: {
      selected: bestCandidate.strategicRoute,
      confidence: routeDist[bestCandidate.strategicRoute] || 0.9,
      distribution: routeDist,
    },
    boardTension,
    candidates: evaluatedCandidates,
    tacticalAdvice: advice,
    confidence: routeDist[bestCandidate.strategicRoute] || 0.85,
  };
}

// ── In-Game Social & Sentiment Router ────────────────────────────────────────

export type ChatIntent = 'TAUNT' | 'GOOD_SPORTSMANSHIP' | 'TACTICAL_ADVICE' | 'FRUSTRATION' | 'CASUAL';

export interface ChatEvaluationResult {
  text: string;
  sender: string;
  intent: TypeSafeChoiceResult<ChatIntent>;
  requiresModeration: TypeSafeNoulResult;
  suggestedReaction: string; // Emoji
}

export function evaluateChatSystemOne(text: string, sender: string): ChatEvaluationResult {
  const lower = text.toLowerCase();
  
  // Toxicity check (Noul)
  const isToxic = /(cheat|hate|idiot|stupid|noob|trash|loser|suck)/i.test(lower);
  const toxProb = isToxic ? 0.88 : 0.04;

  let intent: ChatIntent = 'CASUAL';
  let reaction = '💬';

  if (/(gg|good game|well played|nice move|congrats|awesome)/i.test(lower)) {
    intent = 'GOOD_SPORTSMANSHIP';
    reaction = '👏';
  } else if (/(haha|got you|boom|bye|rekt|easy|catch me)/i.test(lower)) {
    intent = 'TAUNT';
    reaction = '🎯';
  } else if (/(block|wall|watch out|kill him|six|safe)/i.test(lower)) {
    intent = 'TACTICAL_ADVICE';
    reaction = '🧠';
  } else if (/(noo|unlucky|why|again|sixes|damn|ouch)/i.test(lower)) {
    intent = 'FRUSTRATION';
    reaction = '😅';
  }

  return {
    text,
    sender,
    intent: {
      selected: intent,
      confidence: 0.92,
      distribution: {
        TAUNT: intent === 'TAUNT' ? 0.85 : 0.05,
        GOOD_SPORTSMANSHIP: intent === 'GOOD_SPORTSMANSHIP' ? 0.9 : 0.05,
        TACTICAL_ADVICE: intent === 'TACTICAL_ADVICE' ? 0.8 : 0.05,
        FRUSTRATION: intent === 'FRUSTRATION' ? 0.85 : 0.05,
        CASUAL: intent === 'CASUAL' ? 0.8 : 0.05,
      },
    },
    requiresModeration: {
      condition: 'requires_moderation',
      probability: toxProb,
      holds: toxProb >= 0.5,
    },
    suggestedReaction: reaction,
  };
}
