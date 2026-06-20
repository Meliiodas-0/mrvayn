import { useSyncExternalStore } from 'react';

// Lightweight global store for the "shoot the ships" mini-game.
// Multiple ShootableSpaceships instances (one per section) all report kills here
// so a single HUD can show a unified score.

let kills = 0;
let best = typeof window !== 'undefined' ? Number(localStorage.getItem('mrvayn_best_kills') || 0) : 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const gameStore = {
  addKill() {
    kills += 1;
    if (kills > best) {
      best = kills;
      try {
        localStorage.setItem('mrvayn_best_kills', String(best));
      } catch {
        /* ignore quota / privacy-mode errors */
      }
    }
    emit();
  },
  reset() {
    kills = 0;
    emit();
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getKills() {
    return kills;
  },
  getBest() {
    return best;
  },
};

export function useKills() {
  return useSyncExternalStore(
    gameStore.subscribe,
    gameStore.getKills,
    gameStore.getKills,
  );
}

export function useBestKills() {
  return useSyncExternalStore(
    gameStore.subscribe,
    gameStore.getBest,
    gameStore.getBest,
  );
}
