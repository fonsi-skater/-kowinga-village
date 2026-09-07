// playSfx.js
// Plays a short sound effect matching the given name, if a file exists
// at public/audio/sfx/<name>.mp3. Fails silently with a console note if
// the file isn't there yet — same safe-to-wire-in-before-assets-exist
// approach as our music and narration audio.

import { Howl } from 'howler';

export function playSfx(name) {
  const sound = new Howl({
    src: [`/audio/sfx/${name}.mp3`],
    volume: 0.6,
    onloaderror: () => {
      console.log(`[Kowinga] No sound effect found yet at /audio/sfx/${name}.mp3`);
    },
  });
  sound.play();
}
