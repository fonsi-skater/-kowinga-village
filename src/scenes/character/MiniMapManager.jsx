// MiniMapManager.jsx
// Non-visual component: every frame, writes Fonsi's current x/z position
// into the shared store so the MiniMap UI component can draw his dot.
// Lives inside the Canvas (needs useFrame + the physics ref).

import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../state/useGameStore';

export default function MiniMapManager({ targetRef }) {
  useFrame(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();
    useGameStore.getState().setFonsiMapPosition({ x: pos.x, z: pos.z });
  });

  return null;
}
