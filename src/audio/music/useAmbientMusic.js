// useAmbientMusic.js
// Plays a looping background music track using Howler.js. Expects a file
// at public/audio/music/ambient.mp3 — until that file actually exists,
// Howler will fail silently (no crash, just no sound), so this is safe
// to leave wired in even before you've sourced a real track.

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

// `trigger` is a boolean that flips true once the user has done something
// that counts as a browser-required interaction (here: clicking "Enter
// Kowinga" on the intro screen). Music only starts once trigger becomes
// true — before that, calling .play() would be silently blocked anyway
// by the browser's autoplay policy, so we wait for a real signal instead
// of guessing when input might happen.
export function useAmbientMusic(trigger) {
  const soundRef = useRef(null);

  // Create the Howl instance once, on mount.
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

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  // Separate effect: whenever `trigger` flips to true, start playback.
  useEffect(() => {
    if (trigger) {
      soundRef.current?.play();
    }
  }, [trigger]);
}
