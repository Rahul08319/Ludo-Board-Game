import { describe, it, expect } from 'vitest';
import { createInitialState } from '@/lib/ludoGame';
import { evaluateLudoMoveSystemOne, evaluateChatSystemOne } from '@/lib/typeSafeAI';

describe('TypeSafe System One Model Evaluation & Routing', () => {
  it('correctly evaluates initial turn with dice roll 5 and routes to MOBILIZE_RESERVE', () => {
    const state = createInitialState([
      { color: 'red', type: 'human' },
      { color: 'blue', type: 'cpu' },
    ]);
    state.diceValue = 5;

    const movableTokens = [0, 1, 2, 3];
    const evaluation = evaluateLudoMoveSystemOne(state, movableTokens);

    expect(evaluation.recommendedTokenId).not.toBeNull();
    expect(evaluation.routedStrategy.selected).toBe('MOBILIZE_RESERVE');
    expect(evaluation.candidates.length).toBe(4);
    expect(evaluation.candidates[0].strategicRoute).toBe('MOBILIZE_RESERVE');
    expect(evaluation.confidence).toBeGreaterThan(0.5);
  });

  it('correctly routes to OFFENSIVE_STRIKE when kill opportunity exists', () => {
    const state = createInitialState([
      { color: 'red', type: 'human' },
      { color: 'blue', type: 'cpu' },
    ]);
    state.diceValue = 2;

    // Place red token at position 1 (global 1)
    state.players[0].tokens[0].isHome = false;
    state.players[0].tokens[0].position = 1;
    state.players[0].tokens[0].globalPosition = 1;

    // Place blue token at global 3 (which is relative to blue: (3 - 13 + 52) % 52 = 42)
    state.players[1].tokens[0].isHome = false;
    state.players[1].tokens[0].position = 42;
    state.players[1].tokens[0].globalPosition = 3;

    const evaluation = evaluateLudoMoveSystemOne(state, [0]);

    expect(evaluation.recommendedTokenId).toBe(0);
    expect(evaluation.routedStrategy.selected).toBe('OFFENSIVE_STRIKE');
    expect(evaluation.candidates[0].killPotential.holds).toBe(true);
    expect(evaluation.candidates[0].killPotential.probability).toBeGreaterThan(0.9);
  });

  it('evaluates chat sentiment and toxic checks with TypeSafe primitives', () => {
    const friendly = evaluateChatSystemOne('Good game everyone!', 'Alice');
    expect(friendly.intent.selected).toBe('GOOD_SPORTSMANSHIP');
    expect(friendly.requiresModeration.holds).toBe(false);
    expect(friendly.suggestedReaction).toBe('👏');

    const warning = evaluateChatSystemOne('You stupid noob', 'Bob');
    expect(warning.requiresModeration.holds).toBe(true);
    expect(warning.requiresModeration.probability).toBeGreaterThan(0.8);
  });
});
