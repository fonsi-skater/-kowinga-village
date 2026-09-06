// NarrationManager.jsx
// Non-visual component: every frame, checks how far Fonsi is from each
// zone's center. The first time he comes within TRIGGER_RADIUS of a zone,
// its narration line is shown once (via the shared game store) and that
// zone is marked as "played" so it won't repeat on future visits.
//
// This lives inside the Canvas (it needs useFrame), but the actual
// on-screen text is a separate HTML overlay component (NarrationText)
// that just reads activeNarration from the store — see App.jsx.

import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../state/useGameStore';
import { NARRATION_LINES } from '../../story/narrationLines';
import { playNarrationAudio } from '../../audio/narration/playNarrationAudio';
import { ZONE_POSITIONS } from '../../story/zonePositions';

const TRIGGER_RADIUS = 6; // how close Fonsi must get, in world units
const NARRATION_DURATION = 6000; // milliseconds the text stays visible

export default function NarrationManager({ targetRef }) {
  const playedZones = useGameStore((state) => state.playedZones);
  const markZonePlayed = useGameStore((state) => state.markZonePlayed);
  const setActiveNarration = useGameStore((state) => state.setActiveNarration);

  useFrame(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();

    for (const [zoneKey, center] of Object.entries(ZONE_POSITIONS)) {
      if (playedZones.has(zoneKey)) continue; // already shown, skip

      const dx = pos.x - center[0];
      const dz = pos.z - center[2];
      const distance = Math.sqrt(dx * dx + dz * dz); // horizontal distance only

      if (distance <= TRIGGER_RADIUS) {
        markZonePlayed(zoneKey);
        setActiveNarration(NARRATION_LINES[zoneKey]);
        playNarrationAudio(zoneKey);
        // Auto-hide after NARRATION_DURATION — setTimeout is fine here
        // since this fires rarely (once per zone per session), not every frame.
        setTimeout(() => setActiveNarration(null), NARRATION_DURATION);
        break; // only trigger one narration per frame, even if zones overlap
      }
    }
  });

  return null; // this component only manages state, renders nothing itself
}
