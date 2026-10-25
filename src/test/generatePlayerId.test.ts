import { describe, it, expect, beforeEach } from 'vitest';
import {
  generatePlayerId,
  getPlayerIdSource,
  resetPlayerIdForTesting,
  testGeneratePlayerIdWithNullStorage,
} from '@/hooks/useMultiplayer';

describe('generatePlayerId Storage Resilience & Null Handling', () => {
  beforeEach(() => {
    resetPlayerIdForTesting();
  });

  it('generates a valid player ID when sessionStorage is null and sets source to memory', () => {
    // Explicitly pass null to simulate environments where sessionStorage is null/disabled
    const id = generatePlayerId(null);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(getPlayerIdSource()).toBe('memory');
  });

  it('maintains memory caching consistency when sessionStorage is null', () => {
    const firstId = generatePlayerId(null);
    const secondId = generatePlayerId(null);
    const thirdId = generatePlayerId(null);

    expect(firstId).toBe(secondId);
    expect(secondId).toBe(thirdId);
    expect(getPlayerIdSource()).toBe('memory');
  });

  it('safely handles a sandboxed storage that throws SecurityError on getItem or setItem', () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {},
      key: () => null,
      removeItem: () => {},
      getItem: () => {
        throw new Error('SecurityError: Access is denied in sandboxed iframe');
      },
      setItem: () => {
        throw new Error('SecurityError: Storage quota exceeded or disabled');
      },
    };

    // Must not throw an unhandled exception
    let id = '';
    expect(() => {
      id = generatePlayerId(throwingStorage);
    }).not.toThrow();

    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
    expect(getPlayerIdSource()).toBe('memory');
  });

  it('reads from storage when storage is functional and sets source to sessionStorage', () => {
    const store = new Map<string, string>();
    const mockStorage: Storage = {
      length: 0,
      clear: () => store.clear(),
      key: () => null,
      removeItem: (k: string) => store.delete(k),
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    };

    const id = generatePlayerId(mockStorage);
    expect(id).toBeDefined();
    expect(getPlayerIdSource()).toBe('sessionStorage');
    expect(store.get('ludo_player_id')).toBe(id);

    // Call again, should retrieve existing
    resetPlayerIdForTesting();
    const retrievedId = generatePlayerId(mockStorage);
    expect(retrievedId).toBe(id);
    expect(getPlayerIdSource()).toBe('sessionStorage');
  });

  it('runs the dev harness testGeneratePlayerIdWithNullStorage and returns ok: true', () => {
    const result = testGeneratePlayerIdWithNullStorage();

    expect(result.ok).toBe(true);
    expect(result.source).toBe('memory');
    expect(result.cachedConsistently).toBe(true);
    expect(result.playerId).toBeDefined();
    expect(result.error).toBeUndefined();
  });
});
