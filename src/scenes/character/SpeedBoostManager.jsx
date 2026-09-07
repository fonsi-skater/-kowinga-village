// SpeedBoostManager.jsx
// Non-visual component: every frame, checks whether Fonsi's horizontal
// distance from the skating path's center falls within the ring's
// inner/outer radius — i.e., whether he's actually standing ON the path,
// not just somewhere in the village. Updates isSkating accordingly.

import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../state/useGameStore';
import { playSfx } from '../../audio/sfx/playSfx';
import {
  SKATING_PATH_CENTER,
  SKATING_PATH_RADIUS,
  SKATING_PATH_WIDTH,
} from '../environment/SkatingPath';

const INNER_RADIUS = SKATING_PATH_RADIUS - SKATING_PATH_WIDTH / 2;
const OUTER_RADIUS = SKATING_PATH_RADIUS + SKATING_PATH_WIDTH / 2;

export default function SpeedBoostManager({ targetRef }) {
  useFrame(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();

    const dx = pos.x - SKATING_PATH_CENTER[0];
    const dz = pos.z - SKATING_PATH_CENTER[2];
    const distanceFromCenter = Math.sqrt(dx * dx + dz * dz);

    const onPath = distanceFromCenter >= INNER_RADIUS && distanceFromCenter <= OUTER_RADIUS;

    // Only write to the store when the value actually changes — calling
    // setIsSkating every single frame (60x/sec) regardless would trigger
    // unnecessary re-renders in anything reading isSkating.
    const currentValue = useGameStore.getState().isSkating;
    if (onPath !== currentValue) {
      useGameStore.getState().setIsSkating(onPath);
      if (onPath) playSfx('skate-whoosh'); // only on entering, not leaving
    }
  });

  return null;
}
