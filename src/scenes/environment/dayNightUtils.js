// dayNightUtils.js
// Shared time/daylight calculation used by BOTH DayNightCycle (which
// animates sky/light) and Fireflies (which fades in at night) — kept in
// one place so they always agree on what "night" currently means,
// without needing to pass state between them via the store.

export const CYCLE_DURATION = 120; // seconds for one full day/night loop

// Returns a value from 0 (deep night) to 1 (full daylight), given the
// elapsed time in seconds (typically from useFrame's state.clock.elapsedTime).
export function getDaylightAmount(elapsedSeconds) {
  const t = (elapsedSeconds % CYCLE_DURATION) / CYCLE_DURATION;
  return Math.sin(t * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
}
