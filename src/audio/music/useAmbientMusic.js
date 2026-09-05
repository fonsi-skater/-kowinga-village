// useAmbientMusic.js
// Plays a looping background music track using Howler.js. Expects a file
// at public/audio/music/ambient.mp3 — until that file actually exists,
// Howler will fail silently (no crash, just no sound), so this is safe
// to leave wired in even before you've sourced a real track.

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export function useAmbientMusic() {
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/audio/music/ambient.mp3'],
      loop: true,
      volume: 0.4,
      onloaderror: () => {
        // Expected until a real file is added — logged quietly rather
        // than thrown, so the rest of the game keeps working either way.
        console.log('[Kowinga] No ambient music file found yet at /audio/music/ambient.mp3');
      },
    });

    // IMPORTANT: browsers block audio from autoplaying before the user has
    // interacted with the page at all (click, keypress, etc.) — this is a
    // browser policy, not a bug in our code. So instead of calling .play()
    // immediately on mount, we wait for the first keydown (which will
    // naturally happen the moment the player presses WASD to move) and
    // start music then. { once: true } removes the listener after it fires.
    const startOnFirstInput = () => {
      soundRef.current?.play();
    };
    window.addEventListener('keydown', startOnFirstInput, { once: true });

    return () => {
      window.removeEventListener('keydown', startOnFirstInput);
      soundRef.current?.unload();
    };
  }, []);
}
