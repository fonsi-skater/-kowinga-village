// useGameStore.js
// Central place for small pieces of state that multiple components need
// to share — starting with "is Fonsi currently in the river". Using
// Zustand instead of passing more refs/props around keeps this scalable
// as we add more shared state later (current zone, activity, time of day).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Sets aren't natively JSON-serializable (JSON.stringify turns them into
// "{}"), so we need a custom replacer (Set -> plain array on save) and
// reviver (array -> Set again on load) for localStorage persistence to
// work correctly with plantedPlots/tendedBushes/playedZones.
function replacer(key, value) {
  if (value instanceof Set) {
    return { __isSet: true, values: Array.from(value) };
  }
  return value;
}

function reviver(key, value) {
  if (value && value.__isSet) {
    return new Set(value.values);
  }
  return value;
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      isSwimming: false,
      setIsSwimming: (value) => set({ isSwimming: value }),

      // True while Fonsi is on the skating path ring — used to give a speed
      // boost, similar in spirit to isSwimming's speed penalty.
      isSkating: false,
      setIsSkating: (value) => set({ isSkating: value }),

      // True while Fonsi is sitting still at the meditation spot (toggled by
      // pressing E there, not by proximity alone — meditation is a deliberate
      // choice, not something that "just happens" by walking near a tree).
      isMeditating: false,
      setIsMeditating: (value) => set({ isMeditating: value }),

      // Currently displayed narration line, or null if nothing should show.
      // Deliberately NOT persisted (see partialize below) — narration
      // should always restart fresh on reload, not resume mid-sentence.
      activeNarration: null,
      setActiveNarration: (text) => set({ activeNarration: text }),

      // Tracks which zone keys have already shown their narration once, so we
      // don't repeat the same line every time Fonsi walks in and out of a zone.
      playedZones: new Set(),
      markZonePlayed: (zoneKey) => {
        // Set objects are mutated in place, so we create a new Set to trigger
        // a proper state update — Zustand (like React) expects a new reference
        // to know something changed.
        const updated = new Set(get().playedZones);
        updated.add(zoneKey);
        set({ playedZones: updated });
      },

      // Tracks which garden plot INDEXES Fonsi has planted (see Garden.jsx
      // and GardenInteraction.jsx). A plot is either bare soil or planted —
      // no in-between growth stages yet, that's a future refinement.
      plantedPlots: new Set(),
      plantPlot: (index) => {
        const updated = new Set(get().plantedPlots);
        updated.add(index);
        set({ plantedPlots: updated });
      },

      // Tracks which bush INDEXES Fonsi has tended/trimmed — same pattern as
      // plantedPlots. A bush is either wild or tended, no in-between.
      // Which portfolio UI panel is currently open (null, 'about',
      // 'projects', or 'contact') — a pure UI concern, not persisted.
      activePanel: null,
      setActivePanel: (panel) => set({ activePanel: panel }),

      tendedBushes: new Set(),
      tendBush: (index) => {
        const updated = new Set(get().tendedBushes);
        updated.add(index);
        set({ tendedBushes: updated });
      },
    }),
    {
      name: 'kowinga-progress', // localStorage key
      storage: createJSONStorage(() => localStorage, { replacer, reviver }),
      // Only persist the "progress" fields — NOT moment-to-moment states
      // like isSwimming/isSkating/isMeditating/activeNarration, which
      // should always reset to their defaults on a fresh page load rather
      // than resuming mid-activity.
      partialize: (state) => ({
        playedZones: state.playedZones,
        plantedPlots: state.plantedPlots,
        tendedBushes: state.tendedBushes,
      }),
    }
  )
);
