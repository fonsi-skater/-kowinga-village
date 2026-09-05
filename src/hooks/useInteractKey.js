// useInteractKey.js
// Fires the given callback once each time the "interact" key (E) is
// pressed — NOT continuously while held. This is different from
// useKeyboardControls (which tracks held-down state for movement), since
// actions like "plant this plot" should happen once per press, not repeat
// every frame while the key stays down.

import { useEffect } from 'react';

export function useInteractKey(onInteract) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // e.repeat is true when the browser auto-repeats a held key —
      // ignoring it is what makes this "once per press" instead of
      // firing dozens of times while E is held down.
      if (e.code === 'KeyE' && !e.repeat) {
        onInteract();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInteract]);
}
