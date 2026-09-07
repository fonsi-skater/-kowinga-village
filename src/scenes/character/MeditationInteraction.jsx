// MeditationInteraction.jsx
// Non-visual component: pressing E while close to the meditation platform
// toggles isMeditating on/off. Unlike skating (automatic based on
// position) or planting (one-time per plot), meditating is a deliberate
// start/stop action Fonsi chooses — matching the reflective tone of the
// activity itself.

import { useGameStore } from '../../state/useGameStore';
import { useInteractKey } from '../../hooks/useInteractKey';
import { MEDITATION_SPOT_POSITION } from '../environment/MeditationSpot';
import { playSfx } from '../../audio/sfx/playSfx';

const INTERACT_RADIUS = 3;

export default function MeditationInteraction({ targetRef }) {
  const isMeditating = useGameStore((state) => state.isMeditating);
  const setIsMeditating = useGameStore((state) => state.setIsMeditating);

  useInteractKey(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();

    const dx = pos.x - MEDITATION_SPOT_POSITION[0];
    const dz = pos.z - MEDITATION_SPOT_POSITION[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance <= INTERACT_RADIUS) {
      setIsMeditating(!isMeditating);
      playSfx('meditation-chime');
    }
  });

  return null;
}
