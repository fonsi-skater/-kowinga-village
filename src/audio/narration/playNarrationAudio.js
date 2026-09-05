// playNarrationAudio.js
// Plays the voice-line audio matching a given zone key, if one exists at
// public/audio/narration/<key>.m4a. Fails silently and logs a note if the
// file isn't there yet — same "safe to wire in before assets exist"
// approach as useAmbientMusic.
//
// NOTE: .m4a (not .mp3) because that's what Windows' built-in Voice
// Recorder app saves by default — matching the format avoids an extra,
// confusing file-conversion step.

import { Howl } from 'howler';

export function playNarrationAudio(key) {
  const sound = new Howl({
    src: [`/audio/narration/${key}.m4a`],
    volume: 0.9,
    onloaderror: () => {
      console.log(`[Kowinga] No narration audio found yet at /audio/narration/${key}.m4a`);
    },
  });
  sound.play();
}
