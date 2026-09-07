// EasterEggManager.jsx
// A hidden secret: reaching a specific unmarked spot in the far corner
// of the village (nothing visually marks it — genuinely a secret to
// stumble upon) triggers a one-time fun message. No 3D object marks
// this location on purpose.

import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../state/useGameStore';

const SECRET_SPOT = [-22, 0, 20]; // far corner, clear of every named zone
const TRIGGER_RADIUS = 3;

export default function EasterEggManager({ targetRef }) {
  useFrame(() => {
    if (!targetRef.current) return;

    const alreadyFound = useGameStore.getState().foundEasterEgg;
    if (alreadyFound) return; // only ever trigger once

    const pos = targetRef.current.translation();
    const dx = pos.x - SECRET_SPOT[0];
    const dz = pos.z - SECRET_SPOT[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance <= TRIGGER_RADIUS) {
      useGameStore.getState().setFoundEasterEgg(true);
      useGameStore.getState().setShowEasterEggMessage(true);
      // Plain setTimeout here (not a React effect) — this manager isn't a
      // component with its own render cycle to synchronize, it's just
      // reacting to a one-time physics event, so a direct timeout is the
      // simplest correct tool.
      setTimeout(() => useGameStore.getState().setShowEasterEggMessage(false), 6000);
    }
  });

  return null;
}
