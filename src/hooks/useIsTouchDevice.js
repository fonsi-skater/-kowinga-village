// useIsTouchDevice.js
// Detects whether the current device is primarily touch-based (phones,
// tablets) so we can show virtual controls instead of relying on a
// physical keyboard, which touch devices don't have.

import { useState, useEffect } from 'react';

export function useIsTouchDevice() {
  // Derive the INITIAL value directly in useState's initializer function,
  // rather than setting it inside an effect — this avoids an unnecessary
  // extra render on mount. The effect below is only for staying in sync
  // if the device's pointer type changes later (e.g., a 2-in-1 laptop
  // switching between tablet and keyboard mode).
  const [isTouch, setIsTouch] = useState(
    () => window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (e) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isTouch;
}
