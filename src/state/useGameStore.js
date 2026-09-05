// useGameStore.js
// Central place for small pieces of state that multiple components need
// to share — starting with "is Fonsi currently in the river". Using
// Zustand instead of passing more refs/props around keeps this scalable
// as we add more shared state later (current zone, activity, time of day).

import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  isSwimming: false,
  setIsSwimming: (value) => set({ isSwimming: value }),

  // Currently displayed narration line, or null if nothing should show.
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
}));
