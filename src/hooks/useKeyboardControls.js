// useKeyboardControls.js
// Tracks which movement keys are currently held down.
// Returns a ref (not state) because we read this every frame inside
// useFrame — using React state here would cause unnecessary re-renders
// 60 times a second, which we don't want for performance.

import { useEffect, useRef } from 'react';

const keyMap = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

export function useKeyboardControls() {
  const movement = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code];
      if (action) movement.current[action] = true;
    };
    const handleKeyUp = (e) => {
      const action = keyMap[e.code];
      if (action) movement.current[action] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup: always remove listeners when component unmounts,
    // otherwise they pile up and cause bugs if this hook is reused.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}
