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
      // Which zone Fonsi is currently standing in, or null if he's on
      // open ground between zones — drives the "you are here" label.
      // Controls the full intro splash screen shown before entering the
      // village — starts true (shown by default), dismissed once via the
      // "Enter Kowinga" button. Deliberately NOT persisted (not in
      // partialize below) so it shows again on every fresh visit.
      showIntroScreen: true,
      setShowIntroScreen: (value) => set({ showIntroScreen: value }),

      // Fonsi's current world x/z position, updated live each frame by
      // MiniMapManager — used only to draw his dot on the mini-map.
      fonsiMapPosition: { x: 0, z: 0 },
      setFonsiMapPosition: (pos) => set({ fonsiMapPosition: pos }),

      // Prevents the "Village Explorer" celebration from showing more
      // than once per session, even though the completion conditions
      // remain true after the first time they're met.
      hasCelebrated: false,
      setHasCelebrated: (value) => set({ hasCelebrated: value }),

      // True once the hidden secret spot has been discovered — drives the
      // one-time EasterEggMessage popup.
      foundEasterEgg: false,
      setFoundEasterEgg: (value) => set({ foundEasterEgg: value }),

      // Separate from foundEasterEgg (which stays true forever once found)
      // — this transient flag controls whether the popup message is
      // CURRENTLY visible, auto-cleared a few seconds after being found.
      showEasterEggMessage: false,
      setShowEasterEggMessage: (value) => set({ showEasterEggMessage: value }),

      currentZone: null,
      setCurrentZone: (zone) => set({ currentZone: zone }),

      activePanel: null,
      setActivePanel: (panel) => set({ activePanel: panel }),

      // Tracks which individual "first time" achievements have already
      // fired, so each only shows its toast once (first swim, first
      // skate, etc.) — separate from the bigger one-time VillageExplorer
      // celebration, which requires completing everything.
      unlockedAchievements: new Set(),
      // currentToast holds the message text currently animating in, or
      // null. A simple single-slot (not a queue) is fine here since
      // achievements are very unlikely to fire within the same few
      // seconds of each other in normal play.
      currentToast: null,
      unlockAchievement: (key, message) => {
        const current = get().unlockedAchievements;
        if (current.has(key)) return; // already unlocked, don't re-fire
        const updated = new Set(current);
        updated.add(key);
        set({ unlockedAchievements: updated, currentToast: message });
        setTimeout(() => set({ currentToast: null }), 3500);
      },

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
